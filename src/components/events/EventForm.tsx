"use client";

import {EventFormData, eventSchema} from "@/lib/validations/event.schema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {strings} from "@/constans/strings";
import {DateTimePicker} from "@/components/ui/datetime-picker";
import CountryStateCitySelect from "@/components/CountryStateCitySelect";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";


type EventFormProps = {
  mode: 'create' | 'edit';
  userId: string;
  defaultValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  generalError?: string | null;
};

export default function EventForm({mode, userId, defaultValues, onSubmit, generalError}: EventFormProps) {

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: defaultValues?.id,
      userId: userId,
      name: defaultValues?.name,
      startsAt: defaultValues?.startsAt,
      endsAt: defaultValues?.endsAt,
      city: defaultValues?.city,
      state: defaultValues?.state,
      country: defaultValues?.country,
      edition: defaultValues?.edition,
      logoUrl: defaultValues?.logoUrl,
      bannerUrl: defaultValues?.bannerUrl,
      requiresTshirtSize: defaultValues?.requiresTshirtSize ?? false,
      customsQuestions: defaultValues?.customsQuestions,
      waiverUrl: defaultValues?.waiverUrl,
      webSiteUrl: defaultValues?.webSiteUrl
    },
  });

  const { isSubmitting } = form.formState;


  return(
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {mode === "edit" && (
        <input type="hidden" {...form.register("id")} />
      )}

      {/* Error general */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {generalError}
        </div>
      )}

      <FieldGroup>
        {/* Nombre del evento */}
        <Field>
          <FieldLabel htmlFor="name">{strings.events.name}</FieldLabel>
          <Input
            {...form.register("name")}
            id="name"
            type="text"
            placeholder={strings.events.name}
            aria-invalid={form.formState.errors.name ? "true" : "false"}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="flex-row items-end mt-4">

        <Controller
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <DateTimePicker
              label={strings.events.startsAt}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {form.formState.errors.startsAt && (
          <p className="text-sm text-red-600">{form.formState.errors.startsAt.message}</p>
        )}
      </FieldGroup>

      <FieldGroup className="flex-row items-end mt-4">

        <Controller
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <DateTimePicker
              label={strings.events.endsAt}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {form.formState.errors.endsAt && (
          <p className="text-sm text-red-600">{form.formState.errors.endsAt.message}</p>
        )}
      </FieldGroup>

      {/* País / Estado / Ciudad */}
      <CountryStateCitySelect
        control={form.control}
        register={form.register}
        errors={form.formState.errors}
      />

      <FieldGroup className="mt-4">
        <Field>
          <FieldLabel htmlFor="name">{strings.events.edition}</FieldLabel>
          <Input
            {...form.register("edition")}
            id="edition"
            type="text"
            placeholder={strings.events.edition}
            aria-invalid={form.formState.errors.edition ? "true" : "false"}
          />
          {form.formState.errors.edition && (
            <p className="text-sm text-red-600">{form.formState.errors.edition.message}</p>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="mt-4">
        <Field>
          <FieldLabel htmlFor="requires-thsirt-size">{strings.events.requiresShirtSize}</FieldLabel>
          <Controller
            control={form.control}
            name="requiresTshirtSize"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  id="requires-tshirt-size"
                />
                <span className="text-sm text-muted-foreground">{field.value ? "Sí" : "No"}</span>
              </div>
            )}
          />
          {form.formState.errors.requiresTshirtSize && (
            <p className="text-sm text-red-600">{form.formState.errors.requiresTshirtSize.message}</p>
          )}
        </Field>
      </FieldGroup>

      {process.env.NODE_ENV === "development" && Object.keys(form.formState.errors).length > 0 && (
        <pre className="text-xs text-red-500 mt-2">
          {
            JSON.stringify(
              Object.fromEntries(
              Object.entries(form.formState.errors).map(([k, v]) => [k, v?.message])
            ), null, 2
          )}
        </pre>
      )}
      {/*todo: implementar campos faltantes*/}
      <Field className="mt-4">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting
            ? strings.events.loading
            : mode === "create"
              ? "Crear evento"
              : "Guardar cambios"}
        </Button>
      </Field>

    </form>
  )

}