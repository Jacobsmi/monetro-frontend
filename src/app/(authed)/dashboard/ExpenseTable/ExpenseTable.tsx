"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category, Expense } from "@/types/global";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useState } from "react";
import ManageExpenseDialog from "../AddExpenseDialog/ManageExpenseDialog";

export default function ExpenseTable({
  data,
  categories,
}: {
  data: Expense[];
  categories: Category[];
}) {
  const [edittingExpense, setEdittingExpense] = useState<Expense | null>(null);
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `$${value.toFixed(2)}`;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ getValue }) => {
        const category = categories.find(
          (category) => category.id === getValue()
        );
        return category?.name || "Unknown";
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Button onClick={() => setEdittingExpense(row.original)}>
              <Edit />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <ManageExpenseDialog
        initialCategories={categories}
        edittingExpense={edittingExpense}
        setEdittingExpense={setEdittingExpense}
        showTrigger={false}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
