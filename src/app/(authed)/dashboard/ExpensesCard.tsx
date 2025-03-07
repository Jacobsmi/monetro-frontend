import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddExpenseDialog from "./AddExpenseDialog/AddExpenseDialog";
import { createClient } from "@/lib/supabase/server";
import { Category, Expense } from "@/types/global";
import ExpenseTable from "./ExpenseTable/ExpenseTable";

export default async function ExpensesCard() {
  const supabase = await createClient();
  const categoriesResponse = await supabase
    .from("expense_categories")
    .select("*")
    .overrideTypes<Category[], { merge: false }>();
  const expensesResponse = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })
    .limit(10)
    .overrideTypes<Expense[], { merge: false }>();
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Expenses</CardTitle>
        <AddExpenseDialog initialCategories={categoriesResponse.data ?? []} />
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
