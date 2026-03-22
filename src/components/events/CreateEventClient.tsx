"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {EventFormData} from "@/lib/validations/event.schema";
import {createEvent} from "@/lib/actions/event.actions";
import {toast} from "sonner";
import EventForm from "@/components/events/EventForm";

export default function CreateEventClient({userId}: {userId: string}) {

  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(data: EventFormData) {
    setGeneralError(null);
    const result = await createEvent(data);

    if (result.success) {
      toast.success("Evento creado correctamente");
      router.push(`/dashboard/admin/events/`);
    } else {
      if (result.error) {
        setGeneralError(result.error);
        toast.error(result.error);
      }
    }

  }


  return (
    <EventForm
      mode="create"
      userId={userId}
      onSubmit={handleSubmit}
      generalError={generalError}
    />
  );

}