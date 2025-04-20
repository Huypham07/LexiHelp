import browser from "webextension-polyfill";
import { EdgeTTSClient, ProsodyOptions, OUTPUT_FORMAT } from "edge-tts-client";
import {
  createControlPanel,
  StateControlPanel,
  updatePanelContent,
  updatePlayPauseButton,
} from "@/components/controlPanel";
import { Readability } from "@mozilla/readability";
import { franc } from "franc";
import { languageVoiceMap } from "@/utils/languageVoiceMap";

let audioElement: any = null;
let isPlaying = false;
let controlPanel: any = null;

// Make these functions available to the control panel
window.togglePause = togglePause;
window.stopPlayback = stopPlayback;

export async function initTTS(text) {
  cleanup();
  try {
    const settings = await browser.storage.local.get({
      voice: "female",
      rate: 1.0,
      pitch: 1.0,
      volume: 50,
    });

    // Create control panel in loading state
    controlPanel = await createControlPanel(true);

    const tts = new EdgeTTSClient();

    const langCode = franc(text) || "eng";
    console.log("Detected language code:", langCode);
    const voices = languageVoiceMap[langCode] || languageVoiceMap["default"];
    const voiceName = voices[settings.voice as string] || voices["female"];
    await tts.setMetadata(
      voiceName, // Use custom voice if specified
      OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS
      // OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    const prosodyOptions = new ProsodyOptions();
    prosodyOptions.rate = settings.rate as number;
    prosodyOptions.pitch = `${settings.pitch as number}%`;
    prosodyOptions.volume = settings.volume as number;

    return new Promise((resolve, reject) => {
      const mediaSource = new MediaSource();
      let sourceBuffer: SourceBuffer;
      const chunks: Uint8Array[] = [];
      let isFirstChunk = true;

      if (!audioElement) {
        audioElement = new Audio();
        audioElement.muted = true; // 🔧 allow autoplay in Firefox
        audioElement.src = URL.createObjectURL(mediaSource);

        navigator.mediaSession.setActionHandler("play", () => audioElement.play());
        navigator.mediaSession.setActionHandler("pause", () => audioElement.pause());
        navigator.mediaSession.setActionHandler("stop", () => stopPlayback());

        audioElement.onplay = () => {
          audioElement.muted = false;
          isPlaying = true;
          updatePlayPauseButton(StateControlPanel.PAUSED);
        };

        audioElement.onpause = () => {
          isPlaying = false;
          updatePlayPauseButton(StateControlPanel.RESUMED);
        };

        audioElement.onended = () => {
          isPlaying = false;
          updatePlayPauseButton(StateControlPanel.PLAYING);
        };
      }

      // Update control panel immediately to show loading state
      if (controlPanel) {
        updatePanelContent(false);
      }

      const appendNextChunk = () => {
        if (chunks.length > 0 && !sourceBuffer.updating) {
          try {
            const chunk = chunks.shift();
            if (chunk) {
              // SAFELY COPY to avoid DOMException from detached buffer
              const safeChunk = new Uint8Array(chunk.length);
              safeChunk.set(chunk);
              sourceBuffer.appendBuffer(safeChunk);

              if (isFirstChunk) {
                audioElement.play().catch((err) => {
                  console.warn("Audio playback failed:", err);
                });

                isFirstChunk = false;
              }
            }
          } catch (err) {
            console.error("appendNextChunk error:", err, "chunk length:", chunks[0]?.length);

            // Drop the bad chunk so we don't infinitely loop
            chunks.shift();

            // Try the next chunk in the next tick
            setTimeout(appendNextChunk, 100);
          }
        }
      };

      mediaSource.addEventListener("sourceopen", () => {
        try {
          sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');
          sourceBuffer.addEventListener("updateend", appendNextChunk);

          const stream = tts.toStream(text, prosodyOptions);

          stream.on("data", (data) => {
            if (data instanceof Uint8Array) {
              // Firefox fix: clone data before using it
              const cloned = new Uint8Array(data.byteLength);
              cloned.set(data);
              chunks.push(cloned);
              appendNextChunk();
            }
          });

          stream.on("end", () => {
            const checkAndEndStream = () => {
              if (chunks.length === 0 && !sourceBuffer.updating) {
                mediaSource.endOfStream();
                resolve(void 0);
              } else {
                setTimeout(checkAndEndStream, 100);
              }
            };
            checkAndEndStream();
          });

          // stream.on("error", (err) => {
          //   reject(err);
          // });
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("TTS Error:", error);
    cleanup();
    throw error;
  }
}

function togglePause() {
  if (!audioElement) return;

  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

function stopPlayback() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  cleanup();
}

function cleanup() {
  if (audioElement) {
    const oldSrc = audioElement.src;
    audioElement.src = "";
    URL.revokeObjectURL(oldSrc);
  }
  audioElement = null;
  isPlaying = false;
  removeControlPanel();

  // Remove all highlights
  document.querySelectorAll(".lexi-help-highlight").forEach((el) => {
    // Replace the highlighted span with its text content
    const textNode = document.createTextNode(el.textContent);
    el.parentNode.replaceChild(textNode, el);
  });
}

function removeControlPanel() {
  if (controlPanel && controlPanel.parentNode) {
    controlPanel.parentNode.removeChild(controlPanel);
  }
  controlPanel = null;
}

// Define the message structure
interface ExtensionMessage {
  action: string;
  text?: string;
}

// Message listener with type assertion to bypass strict type checking
browser.runtime.onMessage.addListener(function handleMessage(request: ExtensionMessage, sender, sendResponse) {
  if (request.action === "stopPlayback") {
    stopPlayback();
  } else if (request.action === "readSelection") {
    initTTS(request.text).catch((error) => {
      console.error("TTS initialization error:", error);
    });
  } else if (request.action === "readPage") {
    // Extract the page content
    const pageContent = document.body.innerText;

    if (pageContent && pageContent.trim() !== "") {
      initTTS(pageContent).catch((error) => {
        console.error("TTS initialization error:", error);
      });
    } else {
      console.warn("The page content is empty.");
    }
  }

  return true; // Always return true for polyfill compatibility
} as browser.Runtime.OnMessageListener);

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const { action, text } = event.data || {};
  if (action === "triggerTTS" && typeof text === "string") {
    initTTS(text).catch((err) => console.error("initTTS error:", err));
  }
});

// distraction listener

let removeDistractions = false;

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "setRemoveDistractions") {
    if (message.enabled) {
      enableReaderMode();
    } else {
      disableReaderMode();
    }
  }
});

let originalNodes: Node[] | null = null;

function enableReaderMode() {
  if (removeDistractions) return;

  // Lưu lại DOM gốc
  originalNodes = Array.from(document.body.childNodes);

  const article = new Readability(document.cloneNode(true) as Document).parse();
  if (!article) return;

  document.body.replaceChildren();

  const articleElement = document.createElement("article");
  articleElement.style.maxWidth = "800px";
  articleElement.style.margin = "auto";

  articleElement.innerHTML = `<h1>${article.title}</h1>${article.content}`;
  document.body.appendChild(articleElement);

  injectReaderStyle();
  removeDistractions = true;
}

function disableReaderMode() {
  if (!removeDistractions || !originalNodes) return;

  document.body.replaceChildren(...originalNodes);
  removeDistractions = false;
}

function injectReaderStyle() {
  const style = document.createElement("style");
  // can change styles here
  style.textContent = `
    body { background: #f4f4f4; color: #222; line-height: 1.8; font-size: 18px; font-family: sans-serif; padding: 2rem; }
    img { max-width: 100%; height: auto; }
    a { color: #007bff; }
  `;
  document.head.appendChild(style);
}
