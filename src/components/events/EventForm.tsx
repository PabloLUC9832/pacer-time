import {EventFormData} from "@/lib/validations/event.schema";

type EventFormProps = {
  mode: 'create' | 'edit';
  defaultValues?: Partial<EventFormData>;
  obSubmit: (data: EventFormData) => Promise<void>;
  generalError?: string | null;
};

export default function EventForm({mode, defaultValues, obSubmit, generalError}: EventFormProps) {
  //todo: aplicar form y crear vista
  return(
    <div>

    </div>
  )




}