"use client";

import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {strings} from "@/constans/strings";

export default function CreateEventForm() {


  return (
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel>Nombre</FieldLabel>
          <Input
              id="name"
              type="text"
              placeholder={strings.events.name}

          />
        </Field>
      </FieldGroup>
    </form>
  );

}