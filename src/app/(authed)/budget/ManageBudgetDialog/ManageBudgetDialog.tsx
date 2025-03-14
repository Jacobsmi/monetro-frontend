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
import { revalidate } from "@/lib/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import { Budget, Category } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const CategorySchema = z.array(
  z.object({
    id: z.number().optional(),
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
  categories: CategorySchema.min(1, {
    message: "At least one category is required",
  }),
});

export default function ManageBudgetDialog({
  existingBudget,
  existingCategories,
}: {
  existingBudget?: Budget;
  existingCategories: Category[];
}) {
  const [isLoading, setIsLoading] = useState(false);
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
  const supabase = createClient();

  const handleManageBudget = async (
    formData: z.infer<typeof NewBudgetSchema>
  ) => {
    setIsLoading(true);
    if (!existingBudget) {
      const { data }: { data: Budget | null } = await supabase
        .from("budgets")
        .insert({})
        .select()
        .single();

      if (data?.id) {
        await Promise.all(
          formData.categories.map(async (category) => {
            await supabase.from("categories").insert({
              name: category.name,
              budgeted: true,
              budget_id: data.id,
              allocated_amount: category.amount,
            });
          })
        );
      }
    } else if (existingBudget) {
      await Promise.all(
        formData.categories.map(async (category) => {
          const newData = {
            ...(category.id && { id: category.id }),
            name: category.name,
            budgeted: true,
            budget_id: existingBudget.id,
            allocated_amount: category.amount,
          };
          await supabase.from("categories").upsert(newData);
        })
      );
    }
    setOpen(false);
    await revalidate("/budget", "path");
    setIsLoading(false);
  };

  useEffect(() => {
    if (existingBudget && existingCategories) {
      form.reset({
        categories: existingCategories.map((category) => ({
          id: category.id,
          name: category.name,
          amount: category.allocated_amount?.toString() ?? "",
        })),
      });
    }
  }, [existingCategories, existingBudget]);
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button>{existingBudget ? "Edit Budget" : "Create Budget"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a Budget</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleManageBudget)}
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
            {form.formState.errors["categories"]?.type === "too_small" && (
              <div className="w-full text-sm bg-red-200 p-2 rounded-md">
                Must have at least one category
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <>{existingBudget ? "Update Budget" : "Create Budget"}</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
