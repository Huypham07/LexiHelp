import { Type, Palette, Ruler, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TextTab from "./TextTab";
import ColorsTab from "./ColorsTab";
import RulerTab from "./RulerTab";
import ToolsTab from "./ToolsTab";

interface TabsSectionProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  letterSpacing: number;
  setLetterSpacing: (value: number) => void;
  lineHeight: number;
  setLineHeight: (value: number) => void;
  wordSpacing: number;
  setWordSpacing: (value: number) => void;
  bionic: boolean;
  setBionic: (value: boolean) => void;
  ruler: boolean;
  setRuler: (value: boolean) => void;
  colorTheme: string;
  setColorTheme: (value: string) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  fontSize,
  setFontSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  wordSpacing,
  setWordSpacing,
  bionic,
  setBionic,
  ruler,
  setRuler,
  colorTheme,
  setColorTheme,
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

      <TabsContent value="text">
        <TextTab
          fontSize={fontSize}
          setFontSize={setFontSize}
          letterSpacing={letterSpacing}
          setLetterSpacing={setLetterSpacing}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          wordSpacing={wordSpacing}
          setWordSpacing={setWordSpacing}
        />
      </TabsContent>

      <TabsContent value="colors">
        <ColorsTab colorTheme={colorTheme} setColorTheme={setColorTheme} />
      </TabsContent>

      <TabsContent value="ruler">
        <RulerTab ruler={ruler} setRuler={setRuler} />
      </TabsContent>

      <TabsContent value="tools">
        <ToolsTab bionic={bionic} setBionic={setBionic} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
