"use client";

import { cn } from "@/lib/utils";

interface ThemeOptionProps {
  theme: string;
  isSelected: boolean;
  onClick: () => void;
  bgColor: string;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ theme, isSelected, onClick, bgColor }) => {
  const displayName = theme.charAt(0).toUpperCase() + theme.slice(1);

  // Define the color based on the theme
  const getTextColor = (theme: string) => {
    switch (theme) {
      case "high contrast":
        return "text-[#000]";
      case "soft contrast":
        return "text-[#6B4F3C]";
      case "warm and calm":
        return "text-[#003366]";
      case "dark":
        return "text-[#fff]";
      case "light":
        return "text-[#FFFF00]";
      case "muted":
        return "text-[#98FB98]";
      case "neutral":
        return "text-[#4B4B4B]";
      case "subtle and relaxed":
        return "text-[#003366]";
      case "vibrant":
        return "text-[#000]";
      case "hightlight":
        return "text-[#fff]";
      case "pastel":
        return "text-[#4B0082]";
      default:
        return "text-[#000]"; // Default color for custom or other themes
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg flex items-center justify-center transition-all border border-gray-300",
        bgColor,
        isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300",
        getTextColor(theme)
      )}>
      <span className="text-sm font-medium">{displayName}</span>
    </button>
  );
};

export default ThemeOption;