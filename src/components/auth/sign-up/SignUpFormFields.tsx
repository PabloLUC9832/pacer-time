"use client";

import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {strings} from "@/constans/strings";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {SignUpFormData, signUpSchema} from "@/lib/validations/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {signUp} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";
import {InputPassword} from "@/components/ui/inputPassword";

export default function SignUpFormFields() {

  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: SignUpFormData) {

    setGeneralError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await signUp(formData);

    if (result.success) {
      toast.success(`${strings.login.signUpSuccessful}`);
      form.reset();
      router.push("/sign-in");
    } else {
      // Errores por campo
      if (result.fieldErrors) {
        console.log('Errores por campo: ', result.fieldErrors);
        Object.keys(result.fieldErrors).forEach(field => {
          form.setError((field as keyof SignUpFormData), {
            message: result.fieldErrors![field][0]
          });
        });
        const firstErrorField = Object.keys(result.fieldErrors)[0] as keyof SignUpFormData;
        form.setFocus(firstErrorField);

      }

      // Error general
      if (result.error) {
        setGeneralError(result.error);
        toast.error(result.error);
        console.log("Error general: ", result.error);
      }

    }

  }

  return (
    <form onSubmit={ form.handleSubmit(onSubmit) }>
      {/* Error general */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {generalError}
        </div>
      )}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{strings.login.name}</FieldLabel>
          <Input
            {...form.register("name")}
            id="name"
            type="text"
            placeholder={strings.login.name}
            aria-invalid={form.formState.errors.name ? "true" : "false"}
          />
          { form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="last-name">{strings.login.lastName}</FieldLabel>
          <Input
            {...form.register("lastName")}
            id="last-name"
            type="text"
            placeholder={strings.login.lastName}
            aria-invalid={form.formState.errors.lastName ? "true" : "false"}
          />
          { form.formState.errors.lastName && (
              <p className="text-sm text-red-600">
                {form.formState.errors.lastName.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="phone-number">{strings.login.phoneNumber}</FieldLabel>
          <Input
            {...form.register("phoneNumber")}
            id="phone-number"
            type="tel"
            placeholder="229-100-1234"
            aria-invalid={form.formState.errors.phoneNumber ? "true" : "false"}
            onChange={(e) => {
              const formattedNumber = formatPhoneNumber(e.target.value);
              form.setValue("phoneNumber", formattedNumber);
            }}
          />
          { form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-600">
                {form.formState.errors.phoneNumber.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">{strings.login.email}</FieldLabel>
          <Input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder={strings.login.email}
            aria-invalid={form.formState.errors.email ? "true" : "false"}
          />
          { form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
          )}
        </Field>
        <Field>
          <Field className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="password">{strings.login.password}</FieldLabel>
              <InputPassword
                {...form.register("password")}
                id="password"
                placeholder={strings.login.password}
                aria-invalid={form.formState.errors.password ? "true" : "false"}
              />
              { form.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.password.message}
                  </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                {strings.login.confirmPassword}
              </FieldLabel>
              <InputPassword
                {...form.register("confirmPassword")}
                id="confirm-password"
                placeholder={strings.login.password}
                aria-invalid={form.formState.errors.confirmPassword ? "true" : "false"}
              />
              { form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.confirmPassword.message}
                  </p>
              )}
            </Field>
          </Field>
          <FieldDescription>
            {strings.login.passwordRequirements}
          </FieldDescription>
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? strings.login.creatingAccount : strings.login.createAccount}
          </Button>
          <FieldDescription className="text-center">
            {strings.login.haveAccount} <Link href="/sign-in">{strings.login.signIn}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>

  );
}