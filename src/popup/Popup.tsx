import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import React from "react";
import Preview, { PreviewRefs } from "@/components/Preview";
import browser from "webextension-polyfill";

const Popup: React.FC = () => {
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpacing, setWordSpacing] = useState(1);
  const [ruler, setRuler] = useState(false);
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [colorTheme, setColorTheme] = useState("cream");

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
    browser.storage.local
      .get([
        "extensionEnabled",
        "fontSize",
        "letterSpacing",
        "lineHeight",
        "wordSpacing",
        "ruler",
        "colorTheme",
        "voice",
        "speed",
        "pitch",
        "volume",
        "fullscreenStyles",
        "removeDistractions",
      ])
      .then((result) => {
        setExtensionEnabled((result.extensionEnabled as boolean) || false);
        setFontSize((result.fontSize as number) || 18);
        setLetterSpacing((result.letterSpacing as number) || 1);
        setLineHeight((result.lineHeight as number) || 1.5);
        setWordSpacing((result.wordSpacing as number) || 1);
        setRuler((result.ruler as boolean) || false);
        setColorTheme((result.colorTheme as string) || "cream");
        setVoice((result.voice as string) || "female");
        setRate((result.speed as number) || 1.0);
        setPitch((result.pitch as number) || 0);
        setVolume((result.volume as number) || 50);
        setFullscreenStyles((result.fullscreenStyles as boolean) || false);
        setRemoveDistractions((result.removeDistractions as boolean) || false);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      browser.runtime.sendMessage({
        action: "toggleExtension",
        enabled: extensionEnabled,
      });
    }
  }, [extensionEnabled, isLoaded]);

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
            ruler={ruler}
            setRuler={setRuler}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
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
            ruler={ruler}
            colorTheme={colorTheme}
            ref={previewRef}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Popup;
