"use client";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/inputPassword";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CountryStateCitySelect from "@/components/CountryStateCitySelect";
import { strings } from "@/constans/strings";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserFormData } from "@/lib/validations/user.schema";
import { useState } from "react";

type UserFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<UpdateUserFormData>;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  generalError?: string | null;
};

export default function UserForm({ mode, defaultValues, onSubmit, generalError }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: defaultValues?.id ?? "",
      name: defaultValues?.name ?? "",
      fatherLastName: defaultValues?.fatherLastName ?? "",
      motherLastName: defaultValues?.motherLastName ?? "",
      eventName: defaultValues?.eventName ?? "",
      city: defaultValues?.city ?? "Xalapa de Enríquez",
      state: defaultValues?.state ?? "VER",
      country: defaultValues?.country ?? "MX",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      email: defaultValues?.email ?? "",
      role: defaultValues?.role ?? "COMPETITOR",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ID oculto para edición */}
      <input type="hidden" {...form.register("id")} />

      {/* Error general */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {generalError}
        </div>
      )}

      <FieldGroup>
        {/* Nombre y apellidos */}
        <FieldGroup className="md:flex-3 md:flex-row">
          <Field>
            <FieldLabel htmlFor="name">{strings.auth.fields.name}</FieldLabel>
            <Input
              {...form.register("name")}
              id="name"
              type="text"
              placeholder={strings.auth.fields.name}
              aria-invalid={form.formState.errors.name ? "true" : "false"}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="father-last-name">{strings.auth.fields.fatherLastName}</FieldLabel>
            <Input
              {...form.register("fatherLastName")}
              id="father-last-name"
              type="text"
              placeholder={strings.auth.fields.fatherLastName}
              aria-invalid={form.formState.errors.fatherLastName ? "true" : "false"}
            />
            {form.formState.errors.fatherLastName && (
              <p className="text-sm text-red-600">{form.formState.errors.fatherLastName.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="mother-last-name">{strings.auth.fields.motherLastName}</FieldLabel>
            <Input
              {...form.register("motherLastName")}
              id="mother-last-name"
              type="text"
              placeholder={strings.auth.fields.motherLastName}
              aria-invalid={form.formState.errors.motherLastName ? "true" : "false"}
            />
            {form.formState.errors.motherLastName && (
              <p className="text-sm text-red-600">{form.formState.errors.motherLastName.message}</p>
            )}
          </Field>
        </FieldGroup>

        {/* Email y teléfono */}
        <FieldGroup className="md:flex-3 md:flex-row">
          <Field>
            <FieldLabel htmlFor="email">{strings.auth.fields.email}</FieldLabel>
            <Input
              {...form.register("email")}
              id="email"
              type="email"
              placeholder={strings.auth.fields.email}
              aria-invalid={form.formState.errors.email ? "true" : "false"}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
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
                form.setValue("phoneNumber", formatPhoneNumber(e.target.value));
              }}
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
            )}
          </Field>
        </FieldGroup>

        {/* País / Estado / Ciudad */}
        <CountryStateCitySelect
          control={form.control}
          register={form.register}
          errors={form.formState.errors}
        />

        {/* Rol */}
        <Field>
          <FieldLabel>Rol</FieldLabel>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
        </Field>

        {/* Nombre de evento */}
        <Field>
          <FieldLabel htmlFor="event-name">{strings.auth.fields.eventName}</FieldLabel>
          <Input
            {...form.register("eventName")}
            id="event-name"
            type="text"
            placeholder={strings.auth.fields.eventName}
            aria-invalid={form.formState.errors.eventName ? "true" : "false"}
          />
          {form.formState.errors.eventName && (
            <p className="text-sm text-red-600">{form.formState.errors.eventName.message}</p>
          )}
        </Field>

        {/* Contraseña */}
        {mode === "edit" && !showPassword ? (
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPassword(true)}
            >
              Cambiar contraseña
            </Button>
          </Field>
        ) : (
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
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">{strings.auth.fields.confirmPassword}</FieldLabel>
                <InputPassword
                  {...form.register("confirmPassword")}
                  id="confirm-password"
                  placeholder={strings.auth.fields.password}
                  aria-invalid={form.formState.errors.confirmPassword ? "true" : "false"}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                )}
              </Field>
            </Field>
            <FieldDescription>{strings.auth.fields.passwordRequirements}</FieldDescription>
            {mode === "edit" && (
              <button
                type="button"
                className="text-sm text-muted-foreground underline mt-1"
                onClick={() => {
                  setShowPassword(false);
                  form.setValue("password", "");
                  form.setValue("confirmPassword", "");
                }}
              >
                Cancelar cambio de contraseña
              </button>
            )}
          </Field>
        )}

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? strings.auth.signUp.loading
              : mode === "create"
                ? "Crear usuario"
                : "Guardar cambios"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}