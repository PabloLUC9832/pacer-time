import {z} from "zod";
import {strings} from "@/constans/strings";


const eventSchema =
  z.object({
    userId: z.uuid(),
    name: z.string().min(1, `${strings.events.nameRequired}`),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    edition: z.string().optional(),
    logoUrl: z.url().optional(),
    bannerUrl: z.url().optional(),
    requiresTshirtSize: z.boolean().default(false),
    customsQuestions: z.json().optional(),
    waiverUrl: z.url().optional(),
    webSiteUrl: z.url().optional(),
  });

const deleteEventSchema =
  z.object({
    id: z.uuid("ID inválido")
  })


type ActionSuccessResponse = {
  success: true;
  data?: {
    eventId: string;
  };
}

type ActionErrorResponse = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}


export { eventSchema, deleteEventSchema };
export type EventFormData = z.infer<typeof eventSchema>;
export type DeleteEventFormData = z.infer<typeof deleteEventSchema>;
export type EventActionResponse = ActionSuccessResponse | ActionErrorResponse;