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

  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg flex items-center justify-center transition-all border border-gray-300",
        bgColor,
        isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300",
        theme === "dark" ? "text-[#fff]" : "text-[#333]"
      )}>
      <span className="text-sm font-medium">{displayName}</span>
    </button>
  );
};

export default ThemeOption;
