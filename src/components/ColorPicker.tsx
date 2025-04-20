"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({ value = "#d9d9d9", onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [tempColor, setTempColor] = useState(color);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value !== color) {
      setColor(value);
      setTempColor(value);
    }
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="w-24 h-8 rounded-md border-2 p-1.5" 
          variant={"outline"} 
          onClick={() => setTempColor(color)}
        >           
          <div 
            className="w-full h-full rounded-sm" 
            style={{ backgroundColor: color }} 
          />         
        </Button>       
      </PopoverTrigger>       
      <PopoverContent className="p-4 flex flex-col items-center gap-2 w-fit">         
        <HexColorPicker color={tempColor} onChange={setTempColor} />         
        <div className="flex gap-2">           
          <Button 
            className="border-2" 
            size={"sm"} 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel           
          </Button>           
          <Button             
            size={"sm"}             
            onClick={() => {               
              handleColorChange(tempColor);               
              setOpen(false);             
            }}
          >
            OK           
          </Button>         
        </div>       
      </PopoverContent>     
    </Popover>   
  );
}