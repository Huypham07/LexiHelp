import { Label } from "./ui/label";
import ThemeOption from "./ThemeOption";
import { getTextColorByHex, getBackgroundColor } from "@/utils/utils";
import { useEffect } from "react";

interface ColorsTabProps {
  colorTheme: string;
  setColorTheme: (value: string) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ colorTheme, setColorTheme }) => {
  // Function to handle theme change and send message to content script
  // This function is called when a theme is selected
  // It updates the colorTheme state and sends a message to the content script to apply the colors
  const handleApplyColor = (theme: string) => {
    setColorTheme(theme);
    // Send a message to the content script to apply the colors
    // chrome.runtime.sendMessage({
    //   action: "changeColors",
    //   textColor: getTextColor(theme),
    //   backgroundColor: getBackgroundColor(theme)
    // });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs?.[0]?.id;
      if (activeTabId) {
        chrome.tabs.sendMessage(
          activeTabId,
          { action: 'applyColors', textColor: getTextColorByHex(theme), backgroundColor: getBackgroundColor(theme) },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else {
              console.log("Colors applied successfully:", response);
            }
          }
        );
      }
    });

    chrome.storage.local.set({
      textColor: getTextColorByHex(theme),
      backgroundColor: getBackgroundColor(theme),
      theme: theme
    });
  }

  // Load default theme from chrome.storage.local when the component mounts
  useEffect(() => {
    chrome.storage.local.get("theme", (result) => {
      if (result.theme) {
        setColorTheme(result.theme); // Set the default theme
      }
    });
  }, [setColorTheme]);

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
          theme="high contrast"
          isSelected={colorTheme === "high contrast"}
          onClick={() => handleApplyColor("high contrast")}
          bgColor="bg-[#FFFFFF]"
        />
        <ThemeOption
          theme="soft contrast"
          isSelected={colorTheme === "soft contrast"}
          onClick={() => handleApplyColor("soft contrast")}
          bgColor="bg-[#FFF8DC]"
        />
        <ThemeOption
          theme="warm and calm"
          isSelected={colorTheme === "warm and calm"}
          onClick={() => handleApplyColor("warm and calm")}
          bgColor="bg-[#FFFFE0]"
        />
        <ThemeOption
          theme="green"
          isSelected={colorTheme === "green"}
          onClick={() => handleApplyColor("green")}
          bgColor="bg-[#E8F5E9]"
        />
        <ThemeOption
          theme="neutral"
          isSelected={colorTheme === "neutral"}
          onClick={() => handleApplyColor("neutral")}
          bgColor="bg-[#D3D3D3]"
        />
        <ThemeOption
          theme="vibrant"
          isSelected={colorTheme === "vibrant"}
          onClick={() => handleApplyColor("vibrant")}
            bgColor="bg-[#F4C2C2]"
        />
        <ThemeOption
          theme="subtle and relaxed"
          isSelected={colorTheme === "subtle and relaxed"}
          onClick={() => handleApplyColor("subtle and relaxed")}
          bgColor="bg-[#F5F5DC]"
        />
        <ThemeOption
          theme="pastel"
          isSelected={colorTheme === "pastel"}
          onClick={() => handleApplyColor("pastel")}
          bgColor="bg-[#E6E6FA]"
        />
        <ThemeOption
          theme="hightlight"
          isSelected={colorTheme === "hightlight"}
          onClick={() => handleApplyColor("hightlight")}
          bgColor="bg-[#003366]"
        />
        <ThemeOption
          theme="dark"
          isSelected={colorTheme === "dark"}
          onClick={() => handleApplyColor("dark")}
          bgColor="bg-[#000000]"
        />
        <ThemeOption
          theme="light"
          isSelected={colorTheme === "light"}
          onClick={() => handleApplyColor("light")}
          bgColor="bg-[#333333]"
        />
        <ThemeOption
          theme="muted"
          isSelected={colorTheme === "muted"}
          onClick={() => handleApplyColor("muted")}
          bgColor="bg-[#2F4F4F]"
        />
      </div>
      </div>
    </div>
  );
};

export default ColorsTab;
