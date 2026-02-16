"use client";

import {ColumnDef} from "@tanstack/react-table";
import {User} from "../../../generated/prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {strings} from "@/constans/strings";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/*<DropdownMenuLabel>Actions</DropdownMenuLabel>*/}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(`${user.name} ${user.fatherLastName} ${user?.motherLastName || ''}`)}
            >
              {strings.actions.copyName}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{strings.actions.edit}</DropdownMenuItem>
            <DropdownMenuItem>{strings.actions.delete}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
]