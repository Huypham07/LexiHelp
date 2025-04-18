import { Volume2 } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

interface ToolsTabProps {
  ttsHighlight: boolean;
  setTtsHighlight: (value: boolean) => void;
}

const ToolsTab: React.FC<ToolsTabProps> = ({ ttsHighlight, setTtsHighlight }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="remove-distraction" className="text-gray-600">
            Remove Distractions
          </Label>
          <Switch className="cursor-pointer" />
        </div>
        <p className="text-gray-500 text-sm">Hide images, ads, and other distracting elements</p>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="tts-highlight" className="text-gray-600">
            Text-to-Speech Highlight
          </Label>
          <Switch className="cursor-pointer" checked={ttsHighlight} onCheckedChange={setTtsHighlight} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-rate" className="text-gray-600">
            Speech Rate
          </Label>
        </div>
        <Slider id="speech-rate" min={0.5} max={2} step={0.1} defaultValue={[1]} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-pitch" className="text-gray-600">
            Speech Pitch
          </Label>
        </div>
        <Slider id="speech-pitch" min={0.5} max={2} step={0.1} defaultValue={[1]} />
      </div>

      <div className="pt-2 space-y-3">
        <div className="form-row">
          <p className="text-gray-500 text-sm">Read preview text aloud</p>
          <Button variant="outline" size={"sm"} className="text-blue-600">
            <Volume2 className="btn-icon" />
            Speak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsTab;
