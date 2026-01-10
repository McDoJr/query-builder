import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { ColumnsMeta, User } from "@/types/types";

function SortIcons({
  active,
  order,
}: {
  active: boolean;
  order?: "asc" | "desc";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center translate-y-px",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
    >
      <ChevronUp
        size={7}
        className={
          order === "asc" ? "text-foreground" : "text-muted-foreground"
        }
      />
      <ChevronDown
        size={7}
        className={
          order === "desc" ? "text-foreground" : "text-muted-foreground"
        }
      />
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "name";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("name")}
        >
          <p>Name</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: "email",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "email";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("email")}
        >
          <p>Email</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    accessorKey: "age",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "age";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("age")}
        >
          <p>Age</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: (info) => <p>{info.getValue<number>()}</p>,
  },
  {
    accessorKey: "phone",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "phone";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("phone")}
        >
          <p>Phone</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    accessorKey: "address",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "address";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("address")}
        >
          <p>Address</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: (info) => <p>{info.getValue<string>()}</p>,
  },
  {
    accessorKey: "createdAt",
    header: ({ table }) => {
      const meta = table.options.meta as ColumnsMeta;
      const active = meta.sort?.key === "createdAt";

      return (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => meta.onClick("createdAt")}
        >
          <p>Created</p>
          <SortIcons active={active} order={meta.sort?.order} />
        </div>
      );
    },
    cell: (info) => <p>{formatDate(new Date(info.getValue<string>()))}</p>,
  },
];
