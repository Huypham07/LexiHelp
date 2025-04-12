import React, { useCallback, useEffect, useState } from 'react';
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import ColorPicker from "./ColorPicker";

interface RulerTabProps {
  ruler: boolean;
  setRuler: (value: boolean) => void;
}

const RulerTab: React.FC<RulerTabProps> = ({ ruler, setRuler }) => {
  const [color, setColor] = useState("rgba(0, 0, 0, 0.15)");
  const [height, setHeight] = useState(20);

  useEffect(() => {
    if (!chrome?.storage) {
      return;
    }

    chrome.storage.local.get(['color', 'height', 'ruler']).then(({ color, height, ruler }) => {
      if (color) {
        setColor(color);
      }

      if (typeof height === 'number') {
        setHeight(height);
      }

      if (typeof ruler === 'boolean') {
        setRuler(ruler);
      }
    });
  }, []);

  const onColorChange = useCallback((value: { toRgbString: () => any; }) => {
    const rgbString = value.toRgbString();
    setColor(rgbString);

    if (!chrome?.storage) {
      return;
    }

    chrome.storage.local.set({ color: rgbString });
  }, []);

  const onHeightChange = useCallback((value: number) => {
    if (value !== null) {
      setHeight(value);

      if (!chrome?.storage) {
        return;
      }

      chrome.storage.local.set({ height: value });
    }
  }, []);

  const onRulerChange = useCallback((value: boolean) => {
    setRuler(value);

    if (!chrome?.storage) {
      return;
    }

    chrome.storage.local.set({ enabled: value });
  }, []);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler" className="text-gray-600">
            Reading Ruler
          </Label>
          <Switch className="cursor-pointer" checked={ruler} onCheckedChange={onRulerChange} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-height" className="text-gray-600">
            Ruler Height
          </Label>
        </div>
        <Slider id="ruler-height" min={10} max={50} step={1} defaultValue={[20]} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-opacity" className="text-gray-600">
            Ruler Opacity
          </Label>
        </div>
        <Slider id="ruler-opacity" min={10} max={100} step={5} defaultValue={[50]} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-color" className="text-gray-600">
            Ruler Color
          </Label>
          <ColorPicker/>
        </div>
      </div>
    </div>
  );
};

export default RulerTab;