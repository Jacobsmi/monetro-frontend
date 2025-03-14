import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Category, Expense } from "@/types/global";
import ExpenseTable from "./ExpenseTable/ExpenseTable";
import ManageExpenseDialog from "./AddExpenseDialog/ManageExpenseDialog";

export default async function ExpensesCard() {
  const supabase = await createClient();
  const categoriesResponse = await supabase
    .from("categories")
    .select("*")
    .overrideTypes<Category[], { merge: false }>();
  const expensesResponse = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })
    .limit(10)
    .overrideTypes<Expense[], { merge: false }>();
  console.log(categoriesResponse);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Expenses</CardTitle>
        <ManageExpenseDialog
          initialCategories={categoriesResponse.data ?? []}
        />
      </CardHeader>
      <CardContent>
        <ExpenseTable
          data={expensesResponse.data ?? []}
          categories={categoriesResponse.data || []}
        />
      </CardContent>
    </Card>
  );
}
