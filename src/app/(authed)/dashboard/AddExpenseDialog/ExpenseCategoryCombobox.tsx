"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { revalidate } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/global";
import { ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";

export default function ExpenseCategoryCombobox({
  value,
  onChange,
  isCreatingCategory,
  setIsCreatingCategory,
  initialCategories,
}: {
  value: number;
  onChange: (value: number) => void;
  isCreatingCategory: boolean;
  setIsCreatingCategory: (isCreatingCategory: boolean) => void;
  initialCategories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState(initialCategories);

  const handleAddCategory = async () => {
    setOpen(false);
    setIsCreatingCategory(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("expense_categories")
      .insert({
        name: input,
      })
      .select()
      .overrideTypes<Category[], { merge: false }>();
    await revalidate("/dashboard", "path");
    if (data) {
      setCategories([...categories, ...data]);
      onChange(data[0].id);
    }
    setIsCreatingCategory(false);
  };

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between font-normal ${
            !value && "text-muted-foreground"
          }`}
        >
          {isCreatingCategory ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              {value
                ? categories.find((category) => category.id === value)?.name
                : "Expense Category"}
            </>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput value={input} onValueChange={setInput} />
          <CommandList>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                onSelect={() => {
                  onChange(category.id);
                  setOpen(false);
                }}
                className="text-sm"
              >
                {category.name}
              </CommandItem>
            ))}
            {input &&
              !categories.some(
                (category) =>
                  category.name.toLowerCase() === input.toLowerCase()
              ) && (
                <CommandItem
                  onSelect={handleAddCategory}
                  className="text-sm text-blue-600"
                >
                  Create &quot;{input}&quot; category
                </CommandItem>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
