"use server";

import {deleteUserSchema} from "@/lib/validations/user.schema";
import {auth} from "@/lib/auth";
import prisma from "../../../lib/prisma";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {strings} from "@/constans/strings";

export async function deleteUser(id: string) {

  console.log('id::', id);
  const session = await auth();
  // Validación con ZOD
  const parsed = deleteUserSchema.safeParse({id});
  if (!parsed.success) {
   return {
     success: false,
     error: parsed.error.message
   };
  }

  // No permitir auto eliminación
  if (session?.user.id === id) {
    return {
      success: false,
      error: `${strings.messages.cantDeleteYourself}`
    }
  }

  // Operación en DB
  try {
    await prisma.user.update({
      where: {
        id: id
      },
      data: {
        deletedAt: new Date(),
      }
    });
    revalidatePath("/dashboard/admin/users");

    return {
      success: true
    };
  } catch (error) {
    console.error("[DELETE_USER] error:", error);
    return {
      success: false,
      error: "Error al eliminar el usuario"
    };
  }

}