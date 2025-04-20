import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabsSection from "@/components/TabsSection";
import Preview from "@/components/Preview";
import browser from "webextension-polyfill";

const Popup: React.FC = () => {
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpacing, setWordSpacing] = useState(1);
  const [ttsHighlight, setTtsHighlight] = useState(false);
  const [ruler, setRuler] = useState(false);
  const [rulerHeight, setRulerHeight] = useState(20);
  const [rulerOpacity, setRulerOpacity] = useState(100);
  const [rulerColor, setRulerColor] = useState("#d9d9d9");
  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const [colorTheme, setColorTheme] = useState("cream");
  const [fontFamily, setFontFamily] = useState("openDyslexic");

  // Load text styles & enable state from sync storage
  useEffect(() => {
    (async () => {
      const { fontSize, letterSpacing, lineHeight, wordSpacing, fontFamily, extensionEnabled } =
        await browser.storage.local.get([
          "fontSize",
          "letterSpacing",
          "lineHeight",
          "wordSpacing",
          "fontFamily",
          "extensionEnabled",
        ]);

      if (fontSize !== undefined) setFontSize(fontSize as number);
      if (letterSpacing !== undefined) setLetterSpacing(letterSpacing as number);
      if (lineHeight !== undefined) setLineHeight(lineHeight as number);
      if (wordSpacing !== undefined) setWordSpacing(wordSpacing as number);
      if (fontFamily !== undefined) setFontFamily(fontFamily as string);
      if (extensionEnabled !== undefined) setExtensionEnabled(extensionEnabled as boolean);

      // Auto apply styles to all tabs
      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        if (tab.id !== undefined) {
          await browser.tabs.sendMessage(tab.id, {
            type: "UPDATE_ALL_STYLES",
            fontSize,
            letterSpacing,
            lineHeight,
            wordSpacing,
            fontFamily,
          });
        }
      }
    })();
  }, []);

  // Save extension enabled toggle and send message
  useEffect(() => {
    (async () => {
      await browser.storage.local.set({ extensionEnabled });

      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        if (tab.id !== undefined) {
          await browser.tabs.sendMessage(tab.id, {
            type: extensionEnabled ? "ENABLE_EXTENSION" : "DISABLE_EXTENSION",
          });
        }
      }
    })();
  }, [extensionEnabled]);

  // Load settings from storage when component mounts
  // Load ruler config from local storage
  useEffect(() => {
    (async () => {
      const {
        ruler = true,
        rulerHeight = 20,
        rulerOpacity = 30,
        rulerColor = "#d9d9d9",
      } = await browser.storage.local.get(["ruler", "rulerHeight", "rulerOpacity", "rulerColor"]);

      setRuler(ruler as boolean);
      setRulerHeight(rulerHeight as number);
      setRulerOpacity(rulerOpacity as number);
      setRulerColor(rulerColor as string);
    })();
  }, []);

  // Save ruler config + send to content script
  useEffect(() => {
    (async () => {
      const config = {
        ruler,
        height: rulerHeight,
        opacity: rulerOpacity,
        color: rulerColor,
      };

      await browser.storage.local.set(config);

      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab?.id !== undefined) {
        await browser.tabs.sendMessage(tab.id, {
          type: "UPDATE_RULER",
          config,
        });
      }
    })();
  }, [ruler, rulerHeight, rulerOpacity, rulerColor]);

  return (
    <div className="popup-container">
      <Card className="card w-[400px] max-h-[600px] border shadow-md p-0 rounded-none gap-0">
        <Header extensionEnabled={extensionEnabled} setExtensionEnabled={setExtensionEnabled} />
        <CardContent className="card-content flex-1 overflow-y-auto space-y-6 pt-6 pb-3">
          <TabsSection
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
            ttsHighlight={ttsHighlight}
            setTtsHighlight={setTtsHighlight}
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
          />
          <Preview
            fontSize={fontSize}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            wordSpacing={wordSpacing}
            fontFamily={fontFamily}
            ttsHighlight={ttsHighlight}
            ruler={ruler}
            colorTheme={colorTheme}
          />
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
};

export default Popup;
