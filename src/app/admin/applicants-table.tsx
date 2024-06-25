import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/shared";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ApplicationStatus } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  Column,
  ColumnFiltersState,
  Table as ReactTable,
  SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ApplicantsTable() {
  // api for fetching applicants
  const { data: applicants, isFetching } = api.admin.getApplicants.useQuery(
    undefined,
    {
      initialData: [],
    },
  );

  // data table -----------

  const columnHelper = useMemo(
    () => createColumnHelper<RouterOutputs["admin"]["getApplicants"][number]>(),
    [],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("fullName", {
        header: "Name",
        cell: ({ row }) => <p>{row.original.fullName}</p>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ row }) => <p>{row.original.email}</p>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => <p>{capitalizeFirstLetter(row.original.status)}</p>,
      }),
      columnHelper.accessor("submittedAt", {
        header: ({ column }) => {
          const getSort = column.getNextSortingOrder();

          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              title="Timezone: America/Chicago"
            >
              Date
              {getSort ? (
                getSort === "asc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )
              ) : (
                <ArrowUp className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => (
          <p>
            {Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(row.original.submittedAt)}
          </p>
        ),
      }),
    ],
    [createColumnHelper],
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: applicants,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getColumnCanGlobalFilter: (column) => {
      return (
        column.id ===
          ("fullName" satisfies keyof RouterOutputs["admin"]["getApplicants"][number]) ||
        column.id ===
          ("email" satisfies keyof RouterOutputs["admin"]["getApplicants"][number])
      );
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <Card className="max-h-[95%] overflow-auto">
      <CardContent>
        <div className="sticky top-0 z-10 flex gap-4 bg-background py-4">
          <Input
            placeholder="Filter name or email"
            onChange={(event) => {
              // make sure email extension is filtered out
              table.setGlobalFilter(event.target.value);
            }}
            className="w-60"
          />
          <FilterStatus table={table} />
        </div>
        <Table className="rounded-md border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <Link href={`/admin/${row.original.id}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Link>
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
                  {isFetching ? "Loading..." : "No applicants."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function FilterStatus<TData>({ table }: { table: ReactTable<TData> }) {
  return (
    <>
      {table.getColumn("status") && (
        <FacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={Object.values(ApplicationStatus)}
        />
      )}
    </>
  );
}

function FacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: {
  column?: Column<TData, TValue>;
  title?: string;
  options: string[];
}) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValue = column?.getFilterValue() as string;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"secondary"} size={"sm"} className="gap-2">
          {title}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            className="flex items-center justify-between gap-8"
            key={option}
            checked={selectedValue === option}
            onCheckedChange={(value) => {
              column?.setFilterValue(value ? option : undefined);
            }}
          >
            {capitalizeFirstLetter(option)}
            {facets?.get(option) && (
              <span className="font-mono text-xs">{facets.get(option)}</span>
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
