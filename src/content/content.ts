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
import { TextMessage, ToggleMessage } from "@/background/background";

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

// Message listener with type assertion to bypass strict type checking
browser.runtime.onMessage.addListener(async (message: TextMessage) => {
  const { action, text } = message;
  if (action === "stopPlayback") {
    stopPlayback();
  } else if (action === "readSelection") {
    initTTS(text).catch((error) => {
      console.error("TTS initialization error:", error);
    });
  } else if (action === "readPage") {
    // Extract the page content
    const pageContent = document.body.innerText;

    if (pageContent && pageContent.trim() !== "") {
      initTTS(pageContent).catch((error) => {
        console.error("TTS initialization error:", error);
      });
    } else {
      console.warn("The page content is empty.");
    }
  } else if (action === "quick-summary" || action === "smart-summary") {
    showSummarizingNotice();

    try {
      const type = action;
      const summary = await sendSummaryRequest(type, text);
      await showSummaryPopup(summary);
    } catch (err) {
      showErrorPopup(err.message);
    }
  }

  return true; // Always return true for polyfill compatibility
});

async function sendSummaryRequest(type: "quick-summary" | "smart-summary", text: string): Promise<string> {
  const endpoint = `http://localhost:8000/api/summarize/${type === "quick-summary" ? "extract" : "abstract"}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (response.ok) {
    const data = await response.json();
    return data.summary;
  } else {
    switch (response.status) {
      case 500:
        throw new Error("Server error: Please try again later.");
      case 400:
        throw new Error(await response.json().then((data) => data.detail));
      case 406:
        throw new Error(await response.json().then((data) => data.detail));
      case 422:
        throw new Error("Invalid input: Please check the text you provided.");
      default:
        throw new Error("An unknown error occurred. Please try again.");
    }
  }
}

function showSummarizingNotice() {
  const notice = document.createElement("div");
  notice.innerText = "⏳ Generating summary...";
  notice.style.cssText = `
    position:fixed;top:10px;right:10px;
    background:#2196f3;color:#fff;padding:10px 15px;
    border-radius:8px;z-index:9999;font-size:16px;
    box-shadow:0 2px 6px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 2000);
}

async function showSummaryPopup(summary: string) {
  const styles = await getUserStyles();

  const popup = document.createElement("div");
  popup.innerHTML = `<h3>📄 Summary:</h3><p>${summary}</p>`;
  popup.style.cssText = `
      position:fixed; top:20%; left:50%; transform:translateX(-50%);
      background:#fff; padding:20px; border:1px solid #ccc; border-radius:10px;
      box-shadow:0 4px 8px rgba(0,0,0,0.2); max-width:400px; z-index:10000;
      font-size:${styles.fontSize};
      line-height:${styles.lineHeight};
      font-family:${styles.fontFamily};
      letter-spacing:${styles.letterSpacing};
      word-spacing:${styles.wordSpacing};
  `;

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.style.cssText = `
      margin-top:10px; padding:5px 10px; background:#2196f3; color:white;
      border:none; border-radius:5px; cursor:pointer;
  `;
  closeBtn.onclick = () => popup.remove();

  popup.appendChild(closeBtn);
  document.body.appendChild(popup);
}

function showErrorPopup(msg: string) {
  const popup = document.createElement("div");
  popup.innerText = msg;
  popup.style.cssText = `
    position:fixed;top:10px;right:10px;
    background:#e53935;color:#fff;padding:10px;
    border-radius:8px;z-index:9999;font-size:16px;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

async function getUserStyles() {
  const settings = await browser.storage.local.get([
    "extensionEnabled",
    "fontSize",
    "letterSpacing",
    "lineHeight",
    "wordSpacing",
    "colorTheme",
  ]);
  if (settings.extensionEnabled) {
    return {
      fontSize: settings.fontSize || "16px",
      lineHeight: settings.lineHeight || "1.5",
      fontFamily: settings.fontFamily || "OpenDyslexic, Arial, sans-serif",
      letterSpacing: settings.letterSpacing || "0.05em",
      wordSpacing: settings.wordSpacing || "0.1em",
    };
  } else {
    return {
      fontSize: "16px",
      lineHeight: "1.5",
      fontFamily: "OpenDyslexic, Arial, sans-serif",
      letterSpacing: "0.05em",
      wordSpacing: "0.1em",
    };
  }
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const { action, text } = event.data || {};
  if (action === "triggerTTS" && typeof text === "string") {
    initTTS(text).catch((err) => console.error("initTTS error:", err));
  }
});

// distraction listener

let removeDistractions = false;

browser.runtime.onMessage.addListener((message: ToggleMessage) => {
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
