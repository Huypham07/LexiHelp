import { Label } from "./ui/label";
import ThemeOption from "./ThemeOption";
import React from "react";

interface ColorsTabProps {
  colorTheme: string;
  setColorTheme: (value: string) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ colorTheme, setColorTheme }) => {
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
          theme="cream"
          isSelected={colorTheme === "cream"}
          onClick={() => setColorTheme("cream")}
          bgColor="bg-[#FFF8E1]"
        />
        <ThemeOption
          theme="dark"
          isSelected={colorTheme === "dark"}
          onClick={() => setColorTheme("dark")}
          bgColor="bg-[#212121]"
        />
        <ThemeOption
          theme="blue"
          isSelected={colorTheme === "blue"}
          onClick={() => setColorTheme("blue")}
          bgColor="bg-[#E3F2FD]"
        />
        <ThemeOption
          theme="yellow"
          isSelected={colorTheme === "yellow"}
          onClick={() => setColorTheme("yellow")}
          bgColor="bg-[#FFFDE7]"
        />
        <ThemeOption
          theme="green"
          isSelected={colorTheme === "green"}
          onClick={() => setColorTheme("green")}
          bgColor="bg-[#E8F5E9]"
        />
        <ThemeOption
          theme="custom"
          isSelected={colorTheme === "custom"}
          onClick={() => setColorTheme("custom")}
          bgColor="bg-[#F5F5F5]"
        />
      </div>
      </div>
    </div>
  );
};

export default ColorsTab;
