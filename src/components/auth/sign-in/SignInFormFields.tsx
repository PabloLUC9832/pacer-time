"use client";

import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputPassword} from "@/components/ui/inputPassword";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {strings} from "@/constans/strings";
import Link from "next/link";
import {SignInFormData, signInSchema} from "@/lib/validations/auth.schema";
import {signIn} from "@/lib/actions/auth.actions";
import {toast} from "sonner";


export default function SignInFormFields() {

  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: SignInFormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signIn(formData);

    if (result.success) {
      toast.success(strings.auth.signIn.success);
      form.reset();
      router.push("/");
      router.refresh();
    } else {
      // Errores por campo
      if (result.fieldErrors) {
        Object.keys(result.fieldErrors).forEach((field) => {
          form.setError(field as keyof SignInFormData, {
            message: result.fieldErrors![field][0],
          });
        });
      }

      // Error general
      if (result.error) {
        console.log("Error general: ", result.error);
        toast.error(result.error);
      }

    }

  }

  return (
    <form onSubmit={ form.handleSubmit(onSubmit) }>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder={strings.auth.fields.email}
            aria-invalid={form.formState.errors.email ? "true" : "false"}
          />
          { form.formState.errors.email && (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{strings.auth.fields.password}</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              {strings.auth.fields.forgotPassword}
            </Link>
          </div>
          <InputPassword
            {...form.register("password")}
            id="password"
            placeholder="**********"
            aria-invalid={form.formState.errors.password ? "true" : "false"}
          />
          { form.formState.errors.password && (
            <p className="text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {
              isSubmitting ? strings.auth.signIn.loading : strings.auth.signIn.title
            }
          </Button>
          <FieldDescription className="text-center">
            {strings.auth.fields.noAccount} <Link href="/sign-up">{strings.auth.signUp.title}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )

}