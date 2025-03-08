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
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Edit, Loader, Trash } from "lucide-react";
import { useState } from "react";
import ManageExpenseDialog from "../AddExpenseDialog/ManageExpenseDialog";
import { createClient } from "@/lib/supabase/client";
import { revalidate } from "@/lib/actions/revalidate";

export default function ExpenseTable({
  data,
  categories,
}: {
  data: Expense[];
  categories: Category[];
}) {
  const [edittingExpense, setEdittingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const handleDeleteExpense = async (id: number) => {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      await revalidate("/dashboard", "path");
    }
  };

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `$${value.toFixed(2)}`;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId) as string).getTime();
        const dateB = new Date(rowB.getValue(columnId) as string).getTime();
        return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
      },
    },
    {
      accessorKey: "category_id",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </div>
        );
      },

      cell: ({ getValue }) => {
        const category = categories.find(
          (category) => category.id === getValue()
        );
        return category?.name || "Unknown";
      },
      sortingFn: (rowA, rowB, columnId) => {
        const catIdA = rowA.getValue(columnId) as number;
        const catIdB = rowB.getValue(columnId) as number;

        const catNameA =
          categories.find((cat) => cat.id === catIdA)?.name || "";
        const catNameB =
          categories.find((cat) => cat.id === catIdB)?.name || "";

        return catNameA.localeCompare(catNameB);
      },
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setEdittingExpense(row.original)}
            >
              <Edit />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => handleDeleteExpense(row.original.id)}
              disabled={deletingId === row.original.id}
            >
              {deletingId === row.original.id ? (
                <Loader className="animate-spin" />
              ) : (
                <Trash />
              )}
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
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
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
