import { Label } from "./ui/label";
import ThemeOption from "./ThemeOption";
import { getTextColorByHex, getBackgroundColor } from "@/utils/utils";
import { Button } from "./ui/button";

interface ColorsTabProps {
  colorTheme: string;
  setColorTheme: (value: string) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ colorTheme, setColorTheme }) => {
  // Function to handle theme change and send message to content script
  // This function is called when a theme is selected
  // It updates the colorTheme state and sends a message to the content script to apply the colors
  const handleApplyColor = (theme: string) => {

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
      backGroundColor: getBackgroundColor(theme)
    });
  }

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
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {handleApplyColor(colorTheme)}}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ColorsTab;
