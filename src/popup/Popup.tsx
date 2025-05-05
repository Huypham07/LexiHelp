import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import React from "react";
import Preview, { PreviewRefs } from "@/components/Preview";
import browser from "webextension-polyfill";
import { RulerMessage, ToggleMessage, sendToggleMessage } from "@/background/background";
import { applyColorCodingToTab, applyThemeToTab } from "@/content/features/theme";

const Popup: React.FC = () => {
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpacing, setWordSpacing] = useState(1);
  const [ruler, setRuler] = useState(false);
  const [rulerHeight, setRulerHeight] = useState(25);
  const [rulerOpacity, setRulerOpacity] = useState(50);
  const [rulerColor, setRulerColor] = useState("#d9d9d9");
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [colorTheme, setColorTheme] = useState("cream");
  const [colorCodingEnabled, setColorCodingEnabled] = useState(false);
  const [fontFamily, setFontFamily] = useState("openDyslexic");
  const [voice, setVoice] = useState<string>("male");
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  // others tools states
  const [fullscreenStyles, setFullscreenStyles] = useState<boolean>(false);
  const [removeDistractions, setRemoveDistractions] = useState<boolean>(false);

  const previewRef = useRef<PreviewRefs>(null);

  const handleReadPreviewText = async () => {
    await previewRef?.current.onReadPreviewText();
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved settings from storage
    const settingsKeys = [
      "extensionEnabled",
      "fontSize",
      "letterSpacing",
      "lineHeight",
      "wordSpacing",
      "fontFamily",
      "ruler",
      "rulerHeight",
      "rulerOpacity",
      "rulerColor",
      "theme",
      "colorCodingEnabled",
      "voice",
      "speed",
      "pitch",
      "volume",
      "fullscreenStyles",
      "removeDistractions",
    ];

    browser.storage.local.get(settingsKeys).then((result) => {
      const settings = {
        extensionEnabled: Boolean(result.extensionEnabled),
        fontSize: result.fontSize,
        letterSpacing: result.letterSpacing,
        lineHeight: result.lineHeight,
        wordSpacing: result.wordSpacing,
        fontFamily: result.fontFamily,
        ruler: result.ruler,
        rulerHeight: result.rulerHeight,
        rulerOpacity: result.rulerOpacity,
        rulerColor: result.rulerColor,
        colorTheme: result.theme,
        colorCodingEnabled: result.colorCodingEnabled,
        voice: result.voice,
        speed: result.speed,
        pitch: result.pitch,
        volume: result.volume,
        fullscreenStyles: result.fullscreenStyles,
        removeDistractions: result.removeDistractions,
      };

      // Cập nhật các state tương ứng
      Object.entries(settings).forEach(([key, value]) => {
        if (value !== undefined) {
          switch (key) {
            case "extensionEnabled":
              setExtensionEnabled(value as boolean);
              break;
            case "fontSize":
              setFontSize(value as number);
              break;
            case "letterSpacing":
              setLetterSpacing(value as number);
              break;
            case "lineHeight":
              setLineHeight(value as number);
              break;
            case "wordSpacing":
              setWordSpacing(value as number);
              break;
            case "fontFamily":
              setFontFamily(value as string);
              break;
            case "ruler":
              setRuler(value as boolean);
              break;
            case "rulerHeight":
              setRulerHeight(value as number);
              break;
            case "rulerOpacity":
              setRulerOpacity(value as number);
              break;
            case "rulerColor":
              setRulerColor(value as string);
              break;
            case "colorTheme":
              setColorTheme(value as string);
              break;
            case "colorCodingEnabled":
              setColorCodingEnabled(value as boolean);
              break;
            case "voice":
              setVoice(value as string);
              break;
            case "speed":
              setRate(value as number);
              break;
            case "pitch":
              setPitch(value as number);
              break;
            case "volume":
              setVolume(value as number);
              break;
            case "fullscreenStyles":
              setFullscreenStyles(value as boolean);
              break;
            case "removeDistractions":
              setRemoveDistractions(value as boolean);
              break;
            default:
              break;
          }
        }
      });

      setIsLoaded(true);
    });
  }, []);

  // toggle extension on/off
  useEffect(() => {
    browser.storage.local.set({ extensionEnabled: extensionEnabled });
    if (isLoaded) {
      browser.runtime.sendMessage({
        action: "toggleExtension",
        enabled: extensionEnabled,
      });
    }
  }, [extensionEnabled, isLoaded]);

  // text style settings
  useEffect(() => {
    if (isLoaded) {
      const settings = {
        fontFamily,
        fontSize,
        letterSpacing,
        lineHeight,
        wordSpacing,
      };

      browser.storage.local.set(settings);
      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            browser.tabs.sendMessage(tab.id, settings);
          }
        });
      });
    }
  }, [fontFamily, fontSize, letterSpacing, lineHeight, wordSpacing, isLoaded]);

  // theme settings
  useEffect(() => {
    if (isLoaded) {
      browser.storage.local.set({ colorCodingEnabled: colorCodingEnabled });
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          applyThemeToTab(tabId, true, colorTheme).then(() => {
            applyColorCodingToTab(tabId, colorCodingEnabled);
          });
        }
      });
    }
  }, [colorTheme, isLoaded, colorCodingEnabled]);

  // Save ruler config + send to content script
  useEffect(() => {
    if (isLoaded) {
      (async () => {
        const config = {
          ruler,
          rulerHeight,
          rulerOpacity,
          rulerColor,
        };

        await browser.storage.local.set(config);

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (tab?.id !== undefined) {
          const message: RulerMessage = {
            action: "updateRuler",
            config,
          };
          await browser.tabs.sendMessage(tab.id, message);
        }
      })();
    }
  }, [ruler, rulerHeight, rulerOpacity, rulerColor, isLoaded]);

  // Text to speech settings
  useEffect(() => {
    if (isLoaded) {
      const ttsSettings = {
        voice,
        rate,
        pitch,
        volume,
      };
      browser.storage.local.set(ttsSettings);
    }
  }, [voice, rate, pitch, volume, isLoaded]);

  // remove distractions settings
  useEffect(() => {
    if (isLoaded) {
      browser.storage.local.set({ removeDistractions });
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          const message: ToggleMessage = {
            action: "setRemoveDistractions",
            enabled: removeDistractions,
          };
          sendToggleMessage(tab.id, message);
        }
      });
    }
  }, [removeDistractions, isLoaded]);

  return (
    <div className="popup-container">
      <Card className="card w-[400px] max-h-[600px] border shadow-md p-0 rounded-none gap-0">
        <Header extensionEnabled={extensionEnabled} setExtensionEnabled={setExtensionEnabled} />
        <CardContent className="card-content flex-1 overflow-y-auto space-y-6 pt-6 pb-6">
          <TabsSection
            extensionEnabled={extensionEnabled}
            fontSize={fontSize}
            setFontSize={setFontSize}
            letterSpacing={letterSpacing}
            setLetterSpacing={setLetterSpacing}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            wordSpacing={wordSpacing}
            setWordSpacing={setWordSpacing}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            ruler={ruler}
            setRuler={setRuler}
            rulerHeight={rulerHeight}
            setRulerHeight={setRulerHeight}
            rulerOpacity={rulerOpacity}
            setRulerOpacity={setRulerOpacity}
            rulerColor={rulerColor}
            setRulerColor={setRulerColor}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            colorCodingEnabled={colorCodingEnabled}
            setColorCodingEnabled={setColorCodingEnabled}
            voice={voice}
            setVoice={setVoice}
            rate={rate}
            setRate={setRate}
            pitch={pitch}
            setPitch={setPitch}
            volume={volume}
            setVolume={setVolume}
            fullscreenStyles={fullscreenStyles}
            setFullscreenStyles={setFullscreenStyles}
            removeDistractions={removeDistractions}
            setRemoveDistractions={setRemoveDistractions}
            onReadPreviewText={handleReadPreviewText}
          />
          <Preview
            fontSize={fontSize}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            wordSpacing={wordSpacing}
            fontFamily={fontFamily}
            ruler={ruler}
            rulerHeight={rulerHeight}
            rulerOpacity={rulerOpacity}
            rulerColor={rulerColor}
            colorTheme={colorTheme}
            colorCodingEnabled={colorCodingEnabled}
            ref={previewRef}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Popup;
