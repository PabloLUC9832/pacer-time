import {z} from "zod";

export const deleteUserSchema =
  z.object({
    id: z.uuid("ID inválido"),
  });

export type DeleteUserFormData = z.infer<typeof deleteUserSchema>;