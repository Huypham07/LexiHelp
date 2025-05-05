import { Label } from "./ui/label";
import ThemeOption from "./ThemeOption";
import React from "react";
import { Button } from "./ui/button";

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
            bgColor="bg-[#FFFFFF]"
          />
          <ThemeOption
            theme="high contrast"
            isSelected={colorTheme === "high contrast"}
            onClick={() => setColorTheme("high contrast")}
            bgColor="bg-[#FFFFFF]"
          />
          <ThemeOption
            theme="soft contrast"
            isSelected={colorTheme === "soft contrast"}
            onClick={() => setColorTheme("soft contrast")}
            bgColor="bg-[#FFF8DC]"
          />
          <ThemeOption
            theme="warm and calm"
            isSelected={colorTheme === "warm and calm"}
            onClick={() => setColorTheme("warm and calm")}
            bgColor="bg-[#FFFFE0]"
          />
          <ThemeOption
            theme="green"
            isSelected={colorTheme === "green"}
            onClick={() => setColorTheme("green")}
            bgColor="bg-[#E8F5E9]"
          />
          <ThemeOption
            theme="neutral"
            isSelected={colorTheme === "neutral"}
            onClick={() => setColorTheme("neutral")}
            bgColor="bg-[#D3D3D3]"
          />
          <ThemeOption
            theme="vibrant"
            isSelected={colorTheme === "vibrant"}
            onClick={() => setColorTheme("vibrant")}
            bgColor="bg-[#F4C2C2]"
          />
          <ThemeOption
            theme="subtle and relaxed"
            isSelected={colorTheme === "subtle and relaxed"}
            onClick={() => setColorTheme("subtle and relaxed")}
            bgColor="bg-[#F5F5DC]"
          />
          <ThemeOption
            theme="pastel"
            isSelected={colorTheme === "pastel"}
            onClick={() => setColorTheme("pastel")}
            bgColor="bg-[#E6E6FA]"
          />
          <ThemeOption
            theme="hightlight"
            isSelected={colorTheme === "hightlight"}
            onClick={() => setColorTheme("hightlight")}
            bgColor="bg-[#003366]"
          />
          <ThemeOption
            theme="dark"
            isSelected={colorTheme === "dark"}
            onClick={() => setColorTheme("dark")}
            bgColor="bg-[#000000]"
          />
          <ThemeOption
            theme="light"
            isSelected={colorTheme === "light"}
            onClick={() => setColorTheme("light")}
            bgColor="bg-[#333333]"
          />
          <ThemeOption
            theme="muted"
            isSelected={colorTheme === "muted"}
            onClick={() => setColorTheme("muted")}
            bgColor="bg-[#2F4F4F]"
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
