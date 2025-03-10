import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateBudgetDialog from "./CreateBudgetDialog/CreateBudgetDialog";

export default function Budget() {
  return (
    <Card className="w-full max-w-[1200px] mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget</CardTitle>
          <CreateBudgetDialog />
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
