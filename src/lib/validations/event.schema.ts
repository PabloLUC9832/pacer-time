import {z} from "zod";
import {strings} from "@/constans/strings";

const optionalUrl = z
  .string()
  .optional()
  .refine(
    (val) => !val || val === "" || z.url().safeParse(val).success,
    { message: "URL inválida" }
  );

const eventSchema =
  z.object({
    id: z.uuid("ID inválido").optional(),
    userId: z.uuid(),
    name: z.string().min(1, `${strings.events.nameRequired}`),
    startsAt: z.coerce.date<Date>().optional(),
    endsAt: z.coerce.date<Date>().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    edition: z.string().optional(),
    logoUrl: optionalUrl,
    bannerUrl: optionalUrl,
    requiresTshirtSize: z.boolean(),
    customsQuestions: z.unknown().optional(),
    waiverUrl: optionalUrl,
    webSiteUrl: optionalUrl,
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