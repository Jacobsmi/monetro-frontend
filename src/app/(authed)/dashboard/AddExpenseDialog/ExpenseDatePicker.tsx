"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";

export default function ExpenseDatePicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-full justify-start font-normal ${
            !value && "text-muted-foreground"
          }`}
        >
          {value ? format(value, "MM/dd/yyyy") : "Expense Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode={"single"}
          selected={value}
          onSelect={(val) => {
            setOpen(false);
            onChange(val);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
