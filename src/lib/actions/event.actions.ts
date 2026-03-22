"use server";

import {EventActionResponse, EventFormData, eventSchema} from "@/lib/validations/event.schema";
import prisma from "../../../lib/prisma";
import {auth} from "@/lib/auth";
import {z} from "zod";
import {strings} from "@/constans/strings";
import {Prisma} from "../../../generated/prisma/client";

export async function createEvent(data: EventFormData): Promise<EventActionResponse> {

  try {

    const session = await auth();

    const validated = eventSchema.safeParse({
      ...data,
      userId: session?.user?.id,
      logoUrl: data.logoUrl || undefined,
      bannerUrl: data.bannerUrl || undefined,
      waiverUrl: data.waiverUrl || undefined,
      webSiteUrl: data.webSiteUrl || undefined,
    });

    if (!validated.success) {
      console.error("Error en las validaciones del formulario:", validated.error.issues);
      return {
        success: false,
        error: strings.auth.fields.checkFields,
        fieldErrors: z.flattenError(validated.error).fieldErrors,
      };
    }

    const newEvent = await prisma.event.create({
      data: {
        userId: session?.user?.id ?? '',
        name: validated.data.name,
        startsAt: validated.data.startsAt,
        endsAt: validated.data.endsAt,
        city: validated.data.city ?? '',
        state: validated.data.state ?? '',
        country: validated.data.country ?? '',
        edition: validated.data.edition,
        logoUrl: validated.data.logoUrl,
        bannerUrl: validated.data.bannerUrl,
        requiresTshirtSize: validated.data.requiresTshirtSize,
        customsQuestions: validated.data.customsQuestions ?? '{}',
        waiverUrl: validated.data.waiverUrl,
        webSiteUrl: validated.data.webSiteUrl,
      }
    });

    return {
      success: true,
      data: {
        eventId: newEvent.id,
      }
    };

  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.code, error.message);
      if (error.code === "P2002") {
        return {
          success: false,
          error: strings.auth.signUp.existingEmail,
        };
      }
    }

    console.error('Error inesperado al crear evento:', error);
    return {
      success: false,
      error: `Error al crear el evento: ${error}`,
    };

  }

}