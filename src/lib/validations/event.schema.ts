import {z} from "zod";
import {strings} from "@/constans/strings";


const eventSchema =

  z.object({
    name: z.string().min(1, `${strings.events.nameRequired}`),
    startsAt: z.date({
      error: issue => issue.input === undefined ? `${strings.events.startsAtRequired}` : issue.message,
    }).safeParse(new Date()),
    endsAt: z.date({
      error: issue => issue.input === undefined ? `${strings.events.endsAtRequired}` : issue.message,
    }).safeParse(new Date()),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    edition: z.string().optional(),
  });



export { eventSchema };
export type EventFormData = z.infer<typeof eventSchema>;