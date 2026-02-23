"use client";

import {ColumnDef} from "@tanstack/react-table";
import {User} from "../../../generated/prisma/client";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {strings} from "@/constans/strings";
import {UserRowActions} from "@/components/users/user-row-actions";

export const columns:  ColumnDef<User>[] = [
  {
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
  },
  {
    accessorKey: "name",
    meta: {
      label: strings.auth.fields.name,
    },
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {strings.auth.fields.name}
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
  },
  {
    accessorKey: "fatherLastName",
    header: strings.auth.fields.fatherLastName,
    meta: {
      label: strings.auth.fields.fatherLastName,
    }

  },
  {
    accessorKey: "motherLastName",
    header: strings.auth.fields.motherLastName,
    meta: {
      label: strings.auth.fields.motherLastName,
    }
  },
  {
    accessorKey: "role",
    header: "Rol",
    meta: {
      label: "Rol",
    },
  },
  {
    accessorKey: "phoneNumber",
    header: strings.auth.fields.phoneNumber,
    meta: {
      label: strings.auth.fields.phoneNumber,
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const user = row.original;

      return (
        <UserRowActions user={user}/>
      );
    }
  }
]