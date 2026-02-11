"use client";

import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {strings} from "@/constans/strings";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Controller, useForm} from "react-hook-form";
import {SignUpFormData, signUpSchema} from "@/lib/validations/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {signUp} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";
import {InputPassword} from "@/components/ui/inputPassword";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function SignUpFormFields({isCreating = false} : {isCreating?: boolean}) {

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
      fatherLastName: '',
      motherLastName: '',
      eventName: '',
      city: '',
      state: '',
      country: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'COMPETITOR',
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: SignUpFormData) {
    console.log('Enviando datos al servidor:')
    setGeneralError(null);
    console.log('Datos del formulario: ', data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("fatherLastName", data.fatherLastName);
    formData.append("motherLastName", data?.motherLastName ?? '');
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("eventName", data?.eventName ?? '');
    formData.append("city", data?.city ?? '');
    formData.append("state", data?.state ?? '');
    formData.append("country", data?.country ?? '');
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("role", data.role ?? '');

    console.log('::role::', data.role);

    const result = await signUp(formData);

    if (result.success) {
      toast.success(`${strings.auth.signUp.success}`);
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
          <FieldLabel htmlFor="name">{strings.auth.fields.name}</FieldLabel>
          <Input
            {...form.register("name")}
            id="name"
            type="text"
            placeholder={strings.auth.fields.name}
            aria-invalid={form.formState.errors.name ? "true" : "false"}
          />
          { form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="father-last-name">{strings.auth.fields.surnames}</FieldLabel>
          <div className="block space-y-4 md:flex md:space-y-0 md:space-x-4">
            <div>
              <Input
                  {...form.register("fatherLastName")}
                  id="father-last-name"
                  type="text"
                  placeholder={strings.auth.fields.fatherLastName}
                  aria-invalid={form.formState.errors.fatherLastName ? "true" : "false"}
              />
            { form.formState.errors.fatherLastName && (
              <p className="text-sm text-red-600">
                {form.formState.errors.fatherLastName.message}
              </p>
            )}
            </div>
            <div>
              <Input
                {...form.register("motherLastName")}
                id="mother-last-name"
                type="text"
                placeholder={strings.auth.fields.motherLastName}
                aria-invalid={form.formState.errors.motherLastName ? "true" : "false"}
              />
              { form.formState.errors.motherLastName && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.motherLastName.message}
                  </p>
              )}
            </div>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone-number">{strings.auth.fields.phoneNumber}</FieldLabel>
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
          <FieldLabel htmlFor="email">{strings.auth.fields.email}</FieldLabel>
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

        {isCreating && (
          <Field>
            <FieldLabel>Rol</FieldLabel>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Select
                    value={field.value}
                    onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="ORGANIZER">Organizador</SelectItem>
                      <SelectItem value="COMPETITOR">Competidor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/*{form.formState.errors.role && (
              <p className="text-sm text-red-600">
                {form.formState.errors.role.message}
              </p>
            )}*/}
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="event-name">{strings.auth.fields.eventName}</FieldLabel>
          <Input
            {...form.register("eventName")}
            id="event-name"
            type="text"
            placeholder={strings.auth.fields.eventName}
            aria-invalid={form.formState.errors.eventName ? "true" : "false"}
          />
          { form.formState.errors.eventName && (
              <p className="text-sm text-red-600">
                {form.formState.errors.eventName.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="city">{strings.auth.fields.city}</FieldLabel>
          <Input
            {...form.register("city")}
            id="city"
            type="text"
            placeholder={strings.auth.fields.city}
            aria-invalid={form.formState.errors.city ? "true" : "false"}
          />
          { form.formState.errors.city && (
            <p className="text-sm text-red-600">
              {form.formState.errors.city.message}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="city">{strings.auth.fields.state}</FieldLabel>
          <Input
              {...form.register("state")}
              id="state"
              type="text"
              placeholder={strings.auth.fields.state}
              aria-invalid={form.formState.errors.state ? "true" : "false"}
          />
          { form.formState.errors.state && (
              <p className="text-sm text-red-600">
                {form.formState.errors.state.message}
              </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="city">{strings.auth.fields.country}</FieldLabel>
          <Input
              {...form.register("country")}
              id="country"
              type="text"
              placeholder={strings.auth.fields.country}
              aria-invalid={form.formState.errors.country ? "true" : "false"}
          />
          { form.formState.errors.country && (
              <p className="text-sm text-red-600">
                {form.formState.errors.country.message}
              </p>
          )}
        </Field>
        <Field>
          <Field className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="password">{strings.auth.fields.password}</FieldLabel>
              <InputPassword
                {...form.register("password")}
                id="password"
                placeholder={strings.auth.fields.password}
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
                {strings.auth.fields.confirmPassword}
              </FieldLabel>
              <InputPassword
                {...form.register("confirmPassword")}
                id="confirm-password"
                placeholder={strings.auth.fields.password}
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
            {strings.auth.fields.passwordRequirements}
          </FieldDescription>
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? strings.auth.signUp.loading : strings.auth.signUp.title}
          </Button>
          {!isCreating && (
            <FieldDescription className="text-center">
              {strings.auth.signUp.haveAnAccount} <Link href="/sign-in">{strings.auth.signIn.title}</Link>
            </FieldDescription>
          )}

        </Field>
      </FieldGroup>
    </form>

  );
}