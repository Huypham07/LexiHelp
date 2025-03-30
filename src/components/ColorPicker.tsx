"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker() {
  const [color, setColor] = useState("#ff0000");
  const [tempColor, setTempColor] = useState(color);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-24 h-8 rounded-md border-2 p-1.5" variant={"outline"} onClick={() => setTempColor(color)}>
          <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 flex flex-col items-center gap-2 w-fit">
        <HexColorPicker color={tempColor} onChange={setTempColor} />
        <div className="flex gap-2">
          <Button className="border-2" size={"sm"} variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              setColor(tempColor);
              setOpen(false);
            }}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
