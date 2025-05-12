import { Label } from "./ui/label";
import ThemeOption from "./ThemeOption";
import React from "react";
import { Button } from "./ui/button";
import { getBackgroundColor } from "@/utils/color";

interface ColorsTabProps {
  colorTheme: string;
  setColorTheme: (value: string) => void;
  colorCodingEnabled: boolean;
  setColorCodingEnabled: (value: boolean) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ colorTheme, setColorTheme, colorCodingEnabled, setColorCodingEnabled }) => {
  // Function to handle color coding
  const handleColorCoding = async () => {
    setColorCodingEnabled(!colorCodingEnabled); // Update the state immediately
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="color-theme" className="text-gray-600">
            Color Theme
          </Label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ThemeOption
            theme="default"
            isSelected={colorTheme === "default"}
            onClick={() => setColorTheme("default")}
            bgColor={getBackgroundColor("default")}
          />
          <ThemeOption
            theme="high contrast"
            isSelected={colorTheme === "high contrast"}
            onClick={() => setColorTheme("high contrast")}
            bgColor={getBackgroundColor("high contrast")}
          />
          <ThemeOption
            theme="soft contrast"
            isSelected={colorTheme === "soft contrast"}
            onClick={() => setColorTheme("soft contrast")}
            bgColor={getBackgroundColor("soft contrast")}
          />
          <ThemeOption
            theme="warm and calm"
            isSelected={colorTheme === "warm and calm"}
            onClick={() => setColorTheme("warm and calm")}
            bgColor={getBackgroundColor("warm and calm")}
          />
          <ThemeOption
            theme="green"
            isSelected={colorTheme === "green"}
            onClick={() => setColorTheme("green")}
            bgColor={getBackgroundColor("green")}
          />
          <ThemeOption
            theme="neutral"
            isSelected={colorTheme === "neutral"}
            onClick={() => setColorTheme("neutral")}
            bgColor={getBackgroundColor("neutral")}
          />
          <ThemeOption
            theme="vibrant"
            isSelected={colorTheme === "vibrant"}
            onClick={() => setColorTheme("vibrant")}
            bgColor={getBackgroundColor("vibrant")}
          />
          <ThemeOption
            theme="subtle and relaxed"
            isSelected={colorTheme === "subtle and relaxed"}
            onClick={() => setColorTheme("subtle and relaxed")}
            bgColor={getBackgroundColor("subtle and relaxed")}
          />
          <ThemeOption
            theme="pastel"
            isSelected={colorTheme === "pastel"}
            onClick={() => setColorTheme("pastel")}
            bgColor={getBackgroundColor("pastel")}
          />
          <ThemeOption
            theme="highlight"
            isSelected={colorTheme === "highlight"}
            onClick={() => setColorTheme("highlight")}
            bgColor={getBackgroundColor("highlight")}
          />
          <ThemeOption
            theme="dark"
            isSelected={colorTheme === "dark"}
            onClick={() => setColorTheme("dark")}
            bgColor={getBackgroundColor("dark")}
          />
          <ThemeOption
            theme="light"
            isSelected={colorTheme === "light"}
            onClick={() => setColorTheme("light")}
            bgColor={getBackgroundColor("light")}
          />
          <ThemeOption
            theme="muted"
            isSelected={colorTheme === "muted"}
            onClick={() => setColorTheme("muted")}
            bgColor={getBackgroundColor("muted")}
          />
        </div>
        <Button onClick={handleColorCoding}>
          {colorCodingEnabled ? "Disable Color Coding" : "Enable Color Coding"}
        </Button>
      </div>
    </div>
  );
};

export default ColorsTab;
