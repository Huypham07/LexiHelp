import { Type, Palette, Ruler, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TextTab from "./TextTab";
import ColorsTab from "./ColorsTab";
import RulerTab from "./RulerTab";
import ToolsTab from "./ToolsTab";
import React from "react";

interface TabsSectionProps {
  extensionEnabled: boolean;
  fontSize: number;
  setFontSize: (value: number) => void;
  letterSpacing: number;
  setLetterSpacing: (value: number) => void;
  lineHeight: number;
  setLineHeight: (value: number) => void;
  wordSpacing: number;
  setWordSpacing: (value: number) => void;
  ruler: boolean;
  setRuler: (value: boolean) => void;
  rulerHeight: number;
  setRulerHeight: (value: number) => void;
  rulerOpacity: number;
  setRulerOpacity: (value: number) => void;
  rulerColor: string;
  setRulerColor: (value: string) => void;
  colorTheme: string;
  setColorTheme: (value: string) => void;
  colorCodingEnabled: boolean;
  setColorCodingEnabled: (value: boolean) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  voice: string;
  setVoice: (value: string) => void;
  rate: number;
  setRate: (value: number) => void;
  pitch: number;
  setPitch: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  fullscreenStyles: boolean;
  setFullscreenStyles: (value: boolean) => void;
  removeDistractions: boolean;
  setRemoveDistractions: (value: boolean) => void;
  onReadPreviewText: () => Promise<void>;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  extensionEnabled,
  fontSize,
  setFontSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  wordSpacing,
  setWordSpacing,
  fontFamily,
  setFontFamily,
  ruler,
  setRuler,
  rulerHeight,
  setRulerHeight,
  rulerColor,
  setRulerColor,
  rulerOpacity,
  setRulerOpacity,
  colorTheme,
  setColorTheme,
  colorCodingEnabled,
  setColorCodingEnabled,
  voice,
  setVoice,
  rate,
  setRate,
  pitch,
  setPitch,
  volume,
  setVolume,
  fullscreenStyles,
  setFullscreenStyles,
  removeDistractions,
  setRemoveDistractions,
  onReadPreviewText,
}) => {
  return (
    <Tabs defaultValue="text" className="tabs">
      <TabsList className="w-full p-1 rounded-md h-10 mb-6">
        <TabsTrigger value="text">
          <Type className="tab-trigger-icon" />
          Text
        </TabsTrigger>
        <TabsTrigger value="colors">
          <Palette className="tab-trigger-icon" />
          Colors
        </TabsTrigger>
        <TabsTrigger value="ruler">
          <Ruler className="tab-trigger-icon" />
          Ruler
        </TabsTrigger>
        <TabsTrigger value="tools">
          <Volume2 className="tab-trigger-icon" />
          Tools
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text" className={`${!extensionEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <TextTab
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
        />
      </TabsContent>

      <TabsContent value="colors" className={`${!extensionEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <ColorsTab
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
          colorCodingEnabled={colorCodingEnabled}
          setColorCodingEnabled={setColorCodingEnabled}
        />
      </TabsContent>

      <TabsContent value="ruler" className={`${!extensionEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <RulerTab
          ruler={ruler}
          setRuler={setRuler}
          rulerHeight={rulerHeight}
          setRulerHeight={setRulerHeight}
          rulerOpacity={rulerOpacity}
          setRulerOpacity={setRulerOpacity}
          rulerColor={rulerColor}
          setRulerColor={setRulerColor}
        />
      </TabsContent>

      <TabsContent value="tools" className={`${!extensionEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <ToolsTab
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
          onReadPreviewText={onReadPreviewText}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
