import { Volume2 } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import browser from "webextension-polyfill";
import React from "react";

interface ToolsTabProps {
  voice: string;
  setVoice: (value: string) => void;
  rate: number;
  setRate: (value: number) => void;
  pitch: number;
  setPitch: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  fullscreenStyles: boolean;
  setFullscreenStyles: (value: boolean) => void;
  removeDistractions: boolean;
  setRemoveDistractions: (value: boolean) => void;
  onReadPreviewText: () => Promise<void>;
}

const ToolsTab: React.FC<ToolsTabProps> = ({
  voice,
  setVoice,
  rate,
  setRate,
  pitch,
  setPitch,
  volume,
  setVolume,
  fullscreenStyles,
  setFullscreenStyles,
  removeDistractions,
  setRemoveDistractions,
  onReadPreviewText,
}) => {
  const handlePlayClick = async () => {
    await onReadPreviewText();
  };

  // const handleFullscreenStylesChange = (enable: boolean) => {
  //   setFullscreenStyles(enable);
  //   browser.storage.local.set({ fullscreenStyles: enable });
  // };

  return (
    <div className="space-y-5">
      {/* <div className="space-y-2">
        <div className="form-row">
          <Label htmlFor="styles-all" className="text-gray-600">
            Apply styles for fullscreen reading
          </Label>
          <Switch
            className="cursor-pointer"
            checked={fullscreenStyles}
            onCheckedChange={handleFullscreenStylesChange}
          />
        </div>
        <p className="text-gray-500 text-sm">Ctrl + click to apply for target paragraph</p>
      </div> */}

      <div className="space-y-2">
        <div className="form-row">
          <Label htmlFor="remove-distraction" className="text-gray-600">
            Remove Distractions
          </Label>
          <Switch
            className="cursor-pointer"
            checked={removeDistractions}
            onCheckedChange={setRemoveDistractions}
          />
        </div>
        <p className="text-gray-500 text-sm">Hide images, ads, and other distracting elements</p>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="voice" className="text-gray-600">
            Voice
          </Label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger id="voice" className="min-w-40">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="tts-highlight" className="text-gray-600">
            Text-to-Speech Highlight
          </Label>
          <Switch className="cursor-pointer" checked={ttsHighlight} onCheckedChange={setTtsHighlight} />
        </div>
      </div> */}

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="volume" className="text-gray-600">
            Volume:
            <span className="text-gray-500 text-sm">{volume}%</span>
          </Label>
        </div>
        <Slider
          id="volume"
          min={0}
          max={100}
          step={5}
          value={[volume]}
          onValueChange={(values) => setVolume(values[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-rate" className="text-gray-600">
            Speech Rate:
            <span className="text-gray-500 text-sm">{rate}</span>
          </Label>
        </div>
        <Slider
          id="speech-rate"
          min={0.5}
          max={2}
          step={0.25}
          value={[rate]}
          onValueChange={(values) => setRate(values[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-pitch" className="text-gray-600">
            Speech Pitch:
            <span className="text-gray-500 text-sm">{`${pitch < 0 ? pitch : "+" + pitch}%`}</span>
          </Label>
        </div>
        <Slider
          id="speech-pitch"
          min={-50}
          max={50}
          step={5}
          value={[pitch]}
          onValueChange={(values) => setPitch(values[0])}
        />
      </div>

      <div className="pt-2 space-y-3">
        <div className="form-row">
          <p className="text-gray-500 text-sm">Read preview text aloud</p>
          <Button variant="outline" size={"sm"} className="text-blue-600" onClick={handlePlayClick}>
            <Volume2 className="btn-icon" />
            Speak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsTab;
