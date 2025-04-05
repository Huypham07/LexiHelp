import React, { useEffect, useState } from 'react';
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import ColorPicker from "./ColorPicker";

interface RulerTabProps {
  ruler: boolean;
  setRuler: (value: boolean) => void;
  highlight: HTMLElement[];
}

const RulerTab: React.FC<RulerTabProps> = ({ ruler, setRuler, highlight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(20); // Default height in pixels
  const [opacity, setOpacity] = useState(0.3); // Default opacity
  //const [color, setColor] = useState('#ffff00'); // Default yellow

  useEffect(() => {
    if (highlight.length > 0 && currentIndex >= 0) {
      updateHighlight(currentIndex);
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          setCurrentIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setCurrentIndex(prev => Math.min(highlight.length - 1, prev + 1));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [highlight]);

  useEffect(() => {
    updateHighlight(currentIndex);
  }, [currentIndex, height, opacity]);

  const updateHighlight = (index: number) => {
    highlight.forEach(line => line.classList.remove('line-highlight'));
    
    if (index >= 0 && index < highlight.length) {
      const currentLine = highlight[index];
      currentLine.classList.add('line-highlight');
      currentLine.style.setProperty('--highlight-height', `${height}px`);
      currentLine.style.setProperty('--highlight-opacity', opacity.toString());
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
            Ruler Height
          </Label>
        </div>
        <Slider id="ruler-height" min={10} max={50} step={1} defaultValue={[20]} onValueChange={(value) => setHeight(value[0])} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="ruler-opacity" className="text-gray-600">
            Ruler Opacity
          </Label>
        </div>
        <Slider id="ruler-opacity" min={10} max={100} step={5} defaultValue={[50]} onValueChange={(value) => setOpacity(value[0])} />
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