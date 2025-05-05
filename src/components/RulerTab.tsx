import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import ColorPicker from "./ColorPicker";
import React from "react";

interface RulerTabProps {
  ruler: boolean;
  setRuler: (value: boolean) => void;
  rulerHeight: number;
  setRulerHeight: (value: number) => void;
  rulerOpacity: number;
  setRulerOpacity: (value: number) => void;
  rulerColor: string;
  setRulerColor: (value: string) => void;
}

const RulerTab: React.FC<RulerTabProps> = ({
  ruler,
  setRuler,
  rulerHeight,
  setRulerHeight,
  rulerOpacity,
  setRulerOpacity,
  rulerColor,
  setRulerColor,
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler" className="text-gray-600">
            Reading Ruler
          </Label>
          <Switch className="cursor-pointer" checked={ruler} onCheckedChange={setRuler} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-height" className="text-gray-600">
            Ruler Height: {rulerHeight}px
          </Label>
        </div>
        <Slider
          id="ruler-height"
          min={10}
          max={50}
          step={1}
          value={[rulerHeight]}
          onValueChange={(values) => setRulerHeight(values[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-opacity" className="text-gray-600">
            Ruler Opacity: {rulerOpacity}%
          </Label>
        </div>
        <Slider
          id="ruler-opacity"
          min={10}
          max={100}
          step={5}
          value={[rulerOpacity]}
          onValueChange={(values) => setRulerOpacity(values[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-color" className="text-gray-600">
            Ruler Color
          </Label>
          <ColorPicker value={rulerColor} onChange={setRulerColor} />
        </div>
      </div>
    </div>
  );
};

export default RulerTab;
