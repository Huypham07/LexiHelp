import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabsSection from "@/components/TabsSection";
import Preview from "@/components/Preview";

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

  // Load settings from storage when component mounts
  useEffect(() => {
    chrome.storage.local.get(
      {
        ruler: true,
        rulerHeight: 20,
        rulerOpacity: 30,
        rulerColor: "#d9d9d9",
      },
      (items) => {
        setRuler(items.ruler);
        setRulerHeight(items.rulerHeight);
        setRulerOpacity(items.rulerOpacity);
        setRulerColor(items.rulerColor);
      }
    );
  }, []);

  // Update storage and content script when settings change
  useEffect(() => {
    const config = {
      ruler,
      height: rulerHeight,
      opacity: rulerOpacity,
      color: rulerColor,
    };

    // Save to storage
    chrome.storage.sync.set(config);

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "UPDATE_RULER",
          config,
        });
      }
    });
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
            ttsHighlight={ttsHighlight}
            ruler={ruler}
            colorTheme={colorTheme}
          />
        </CardContent>
        <Footer/>
      </Card>
    </div>
  );
};

export default Popup;