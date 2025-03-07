"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ExpenseDatePicker from "./ExpenseDatePicker";
import ExpenseCategoryCombobox from "./ExpenseCategoryCombobox";
import { Category, Expense } from "@/types/global";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "lucide-react";
import { revalidate } from "@/lib/actions/revalidate";

const NewExpenseSchema = z.object({
  name: z.string().min(1, { message: "Expense name is required" }),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  date: z.date({ required_error: "Expense date is required" }),
  category: z.number().min(1, { message: "Expense category is required" }),
});

export default function AddExpenseDialog({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);

  const form = useForm<z.infer<typeof NewExpenseSchema>>({
    defaultValues: {
      name: "",
      amount: "",
      date: undefined,
      category: 0,
    },
    resolver: zodResolver(NewExpenseSchema),
  });

  const handleAddExpense = async (
    formData: z.infer<typeof NewExpenseSchema>
  ) => {
    setIsCreatingExpense(true);
    const supabase = createClient();
    console.log("Create new expense with data", formData);
    const { error } = await supabase
      .from("expenses")
      .insert({
        name: formData.name,
        amount: formData.amount,
        date: formData.date,
        category_id: formData.category,
      })
      .select()
      .overrideTypes<Expense, { merge: false }>();
    if (!error) {
      await revalidate("/dashboard", "path");
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setIsCreatingCategory(false);
        setIsCreatingExpense(false);
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add an Expense</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddExpense)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Expense Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Expense Amount"
                      type="number"
                      step={0.01}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel>
                  <FormControl>
                    <ExpenseDatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Category</FormLabel>
                  <FormControl>
                    <ExpenseCategoryCombobox
                      value={field.value}
                      onChange={field.onChange}
                      isCreatingCategory={isCreatingCategory}
                      setIsCreatingCategory={setIsCreatingCategory}
                      initialCategories={initialCategories}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isCreatingCategory || isCreatingExpense}
            >
              {isCreatingExpense ? (
                <Loader className="animate-spin" />
              ) : (
                "Add Expense"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
