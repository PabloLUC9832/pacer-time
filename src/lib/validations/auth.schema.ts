import {z} from "zod";
import {strings} from "@/constans/strings";

const signUpSchema  =
  z.object({
    name: z.string().min(1, `${strings.auth.signUp.name}`),
    fatherLastName: z.string().min(1, `${strings.auth.signUp.lastName}`),
    motherLastName: z.string().optional(),
    eventName: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    phoneNumber: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, `${strings.auth.signUp.phoneNumber}`),
    email: z.email(`${strings.auth.signUp.email}`),
    password: z.string().min(8, `${strings.auth.signUp.password}`),
    confirmPassword: z.string().min(8, `${strings.auth.signUp.password}`),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword, {
        message: `${strings.auth.signUp.passwordDontMatch}`,
        path: ["confirmPassword"],
      }
  );

const signInSchema =
  z.object({
    email: z.email(`${strings.auth.signUp.email}`),
    password: z.string().min(8, `${strings.auth.signUp.password}`),
  });

export type ActionSuccessResponse = {
  success: true;
  data?: {
    userId: string;
    email: string;
  };
}

export type ActionErrorResponse = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export { signUpSchema, signInSchema };
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ActionResponse = ActionSuccessResponse | ActionErrorResponse;
