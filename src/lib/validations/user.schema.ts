import { z } from "zod";
import { strings } from "@/constans/strings";

export const deleteUserSchema =
  z.object({
    id: z.uuid("ID inválido"),
  });

export const updateUserSchema = z.object({
  id: z.uuid("ID inválido"),
  name: z.string().min(1, `${strings.auth.signUp.name}`),
  fatherLastName: z.string().min(1, `${strings.auth.signUp.lastName}`),
  motherLastName: z.string().optional(),
  eventName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, `${strings.auth.signUp.phoneNumber}`),
  email: z.email(`${strings.auth.signUp.email}`),
  role: z.enum(["ADMIN", "ORGANIZER", "COMPETITOR"]).optional(),
  // Contraseña completamente opcional en edición
  password: z.string().min(8, `${strings.auth.signUp.password}`).optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
})
  .refine(
    (data) => {
      // Solo valida si el usuario escribió algo en password
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: `${strings.auth.signUp.passwordDontMatch}`,
      path: ["confirmPassword"],
    }
  );

export type DeleteUserFormData = z.infer<typeof deleteUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;