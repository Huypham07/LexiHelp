"use client";

import { cn } from "@/lib/utils";
import { getTextColorByHex } from "@/utils/color";
import React from "react";

interface ThemeOptionProps {
  theme: string;
  isSelected: boolean;
  onClick: () => void;
  bgColor: string;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ theme, isSelected, onClick, bgColor }) => {
  const displayName = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <button
      onClick={() => {
        onClick();
        console.log("Selected theme:", theme);
      }}
      className={cn(
        "h-10 rounded-lg flex items-center justify-center transition-all border border-gray-300",
        isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
      )}
      style={{
        backgroundColor: bgColor,
      }}>
      <span className="text-sm font-medium" style={{ color: getTextColorByHex(theme) }}>
        {displayName}
      </span>
    </button>
  );
};

export default ThemeOption;
