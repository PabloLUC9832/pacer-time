"use server";

import {EventActionResponse, eventSchema} from "@/lib/validations/event.schema";
import prisma from "../../../lib/prisma";
import {auth} from "@/lib/auth";
import { z } from "zod";
import {strings} from "@/constans/strings";
import {Prisma} from "../../../generated/prisma/client";

export async function createEvent(formData: FormData): Promise<EventActionResponse> {

  try {

    const session = await auth();

    const rawData = {
      name: formData.get('name'),
      startsAt: formData.get('startsAt'),
      endsAt: formData.get('endsAt'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      edition: formData.get('edition'),
      logoUrl: formData.get('logoUrl'),
      bannerUrl: formData.get('bannerUrl'),
      requiresTshirtSize: formData.get('requiresTshirtSize'),
      customsQuestions: formData.get('customsQuestions'),
      waiverUrl: formData.get('waiverUrl'),
      webSiteUrl: formData.get('webSiteUrl'),
    };

    const validatedData = eventSchema.parse(rawData);

    const newEvent = await prisma.event.create({
      data: {
        userId: session?.user.id ?? '',
        name: validatedData.name,
        startsAt: validatedData.startsAt,
        endsAt: validatedData.endsAt,
        city: validatedData.city ?? '',
        state: validatedData.state ?? '',
        country: validatedData.country ?? '',
        edition: validatedData.edition,
        logoUrl: validatedData.logoUrl,
        bannerUrl: validatedData.bannerUrl,
        requiresTshirtSize: validatedData.requiresTshirtSize,
        customsQuestions: validatedData.customsQuestions ?? '{}',
        waiverUrl: validatedData.waiverUrl,
        webSiteUrl: validatedData.webSiteUrl,
      }
    });

    return {
      success: true,
      data: {
        eventId: newEvent.id,
      }
    }

  } catch (error) {

    if (error instanceof z.ZodError) {

      console.error('Error en las validaciones del formulario: ',error.issues);

      return {
        success: false,
        error: strings.auth.fields.checkFields,
        fieldErrors: z.flattenError(error).fieldErrors,
      }
    }

    if (error instanceof  Prisma.PrismaClientKnownRequestError) {
      console.error('Error en las validaciones del formulario.', error.code, error.message);
      if (error.code === "P2002") {
        return {
          success: false,
          error: strings.auth.signUp.existingEmail,
        };
      }
    }

    return {
      success: false,
      error: `Error al crear el evento, ${error}`,
    }


  }



}