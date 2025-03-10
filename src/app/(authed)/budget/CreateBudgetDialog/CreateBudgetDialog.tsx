"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const CategorySchema = z.array(
  z.object({
    name: z.string().min(1, { message: "Category name is required" }),
    amount: z
      .string()
      .min(1, { message: "Amount is required" })
      .refine((val) => !isNaN(parseFloat(val)), {
        message: "Amount must be a valid number",
      })
      .refine((val) => parseFloat(val) > 0, {
        message: "Amount must be greater than 0",
      }),
  })
);
const NewBudgetSchema = z.object({
  categories: CategorySchema,
});

export default function CreateBudgetDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof NewBudgetSchema>>({
    defaultValues: {
      categories: [],
    },
    resolver: zodResolver(NewBudgetSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button>Create Budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a Budget</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
            })}
            className="flex flex-col gap-4"
          >
            {fields.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No categories added yet. Add a category to continue.
              </div>
            )}
            {fields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`categories.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="Category Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categories.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Category Amount"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                >
                  <Trash />
                </Button>
              </div>
            ))}
            <Button
              variant={"outline"}
              type="button"
              onClick={() => append({ name: "", amount: "" })}
            >
              <Plus /> Add Category
            </Button>
            <Button type="submit">Create Budget</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
