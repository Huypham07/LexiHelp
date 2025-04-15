import { BookOpen } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Switch } from "./ui/switch";
import React from "react";
import browser from "webextension-polyfill";
interface HeaderProps {
  extensionEnabled: boolean;
  setExtensionEnabled: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ extensionEnabled, setExtensionEnabled }) => {

  const handleSwitchChange = (checked: boolean) => {
    setExtensionEnabled(checked);
    browser.storage.local.set({ extensionEnabled: checked });
  };

  return (
    <CardHeader className="card-header bg-primary text-white rounded-b-md px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="card-title text-2xl font-semibold">
            <BookOpen className="inline mr-2" size={24} />
            LexiHelp
          </CardTitle>
          <CardDescription className="card-description text-sm text-white/90 mt-1.5">
            Reading assistant for dyslexia
          </CardDescription>
        </div>
        <Switch
          className="cursor-pointer"
          checked={extensionEnabled}
          onCheckedChange={handleSwitchChange}
          size="large"
        />
      </div>
    </CardHeader>
  );
};

export default Header;
