import {z} from "zod";
import {strings} from "@/constans/strings";

const signUpSchema  =
  z.object({
    name: z.string().min(1, `${strings.login.signUpRequirements.name}`),
    lastName: z.string().min(1, `${strings.login.signUpRequirements.lastName}`),
    phoneNumber: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, `${strings.login.signUpRequirements.phoneNumber}`),
    email: z.email(`${strings.login.signUpRequirements.email}`),
    password: z.string().min(8, `${strings.login.signUpRequirements.password}`),
    confirmPassword: z.string().min(8, `${strings.login.signUpRequirements.password}`),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword, {
        message: `${strings.login.signUpRequirements.passwordDontMatch}`,
        path: ["confirmPassword"],
      }
  );

export type ActionSuccessResponse = {
    success: true;
    data: {
      userId: string;
      email: string;
    };
}

export type ActionErrorResponse = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export { signUpSchema };
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ActionResponse = ActionSuccessResponse | ActionErrorResponse;
