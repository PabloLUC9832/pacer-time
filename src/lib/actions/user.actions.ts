"use server";

import { deleteUserSchema, updateUserSchema } from "@/lib/validations/user.schema";
import { auth } from "@/lib/auth";
import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { strings } from "@/constans/strings";
import { ActionResponse } from "@/lib/validations/auth.schema";
import bcrypt from "bcryptjs";

export async function deleteUser(id: string) {
  const session = await auth();
  const parsed = deleteUserSchema.safeParse({ id });

  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  if (session?.user.id === id) {
    return { success: false, error: `${strings.messages.cantDeleteYourself}` };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_USER] error:", error);
    return { success: false, error: "Error al eliminar el usuario" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        fatherLastName: true,
        motherLastName: true,
        phoneNumber: true,
        email: true,
        eventName: true,
        city: true,
        state: true,
        country: true,
        role: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado o eliminado" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("[GET_USER_BY_ID] error:", error);
    return { success: false, error: "Error al obtener el usuario" };
  }
}

export async function updateUser(formData: FormData): Promise<ActionResponse> {
  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    fatherLastName: formData.get("fatherLastName") as string,
    motherLastName: formData.get("motherLastName") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    email: formData.get("email") as string,
    eventName: formData.get("eventName") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: formData.get("country") as string,
    role: formData.get("role") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = updateUserSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((err) => {
      const field = err.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(err.message);
    });
    return { success: false, error: "Datos inválidos", fieldErrors };
  }

  const { id, password, confirmPassword: _confirm, ...rest } = parsed.data;

  try {
    const updateData: Record<string, unknown> = { ...rest };

    // Solo actualiza contraseña si se proporcionó una nueva
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath(`/dashboard/admin/users/${id}`);

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_USER] error:", error);
    return { success: false, error: "Error al actualizar el usuario" };
  }
}