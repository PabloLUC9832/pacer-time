"use client";

import {User} from "../../../generated/prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash2Icon} from "lucide-react";
import {strings} from "@/constans/strings";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useState, useTransition} from "react";
import {deleteUser} from "@/lib/actions/user.actions";
import {toast} from "sonner";

interface Props {
  user: User;
}

export function UserRowActions({user} : Props) {

  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast.success("Usuario eliminado correctamente");
        setOpenDelete(false);
      } else {
        toast.error("Error al eliminar el usuario");
      }
    });
  }


  return (

    <>

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
          <DropdownMenuItem onSelect={() => setOpenDelete(true)}>{strings.actions.delete}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal para eliminar un usuario */}

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>¿Eliminar a {user.name} {user.fatherLastName} {user?.motherLastName ?? '' }?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a {user.name} {user.fatherLastName} {user?.motherLastName ?? '' } y no se podrá recuperar. ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? "Eliminando..." : "Eliminar"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>

  );


}