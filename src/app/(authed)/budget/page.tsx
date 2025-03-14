import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ManageBudgetDialog from "./ManageBudgetDialog/ManageBudgetDialog";
import { createClient } from "@/lib/supabase/server";
import { Budget as BudgetType, Category } from "@/types/global";
import BudgetTable from "./BugetTable/BudgetTable";

export default async function Budget() {
  const supabase = await createClient();
  const budgetsResponse = await supabase
    .from("budgets")
    .select("*")
    .overrideTypes<BudgetType[], { merge: false }>();

  let budgetedCategoriesResponse;
  if (budgetsResponse.data?.length) {
    budgetedCategoriesResponse = await supabase
      .from("categories")
      .select("*")
      .eq("budget_id", budgetsResponse.data?.[0].id)
      .overrideTypes<Category[], { merge: false }>();
  }
  return (
    <Card className="w-full max-w-[1200px] mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget</CardTitle>
          <ManageBudgetDialog
            existingBudget={budgetsResponse.data?.[0]}
            existingCategories={budgetedCategoriesResponse?.data ?? []}
          />
        </div>
      </CardHeader>
      <CardContent>
        {budgetedCategoriesResponse?.data?.length && (
          <BudgetTable data={budgetedCategoriesResponse?.data ?? []} />
        )}
      </CardContent>
    </Card>
  );
}
