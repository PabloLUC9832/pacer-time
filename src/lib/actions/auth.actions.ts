"use server";

import {ActionResponse, signUpSchema} from "@/lib/validations/auth.schema";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "../../../generated/prisma/client";

export async function signUp(formData: FormData): Promise<ActionResponse> {

  try {

    const rawData = {
      name : formData.get('name'),
      lastName : formData.get('lastName'),
      phoneNumber : formData.get('phoneNumber'),
      email : formData.get('email'),
      password : formData.get('password'),
      confirmPassword : formData.get('confirmPassword'),
    };

    const validatedData = signUpSchema.parse(rawData);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newAccount = await prisma.user.create({
      data: {
        name: validatedData.name,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      data: {
        userId: newAccount.id,
        email: newAccount.email,
      }
    }

  } catch (error) {

    if (error instanceof z.ZodError) {

      console.error('Error en las validaciones del formulario: ',error.issues);

      return {
        success: false,
        error: `Por favor verifica los campos del formulario.`,
        fieldErrors: z.flattenError(error).fieldErrors,
      }
    }

    if (error instanceof  Prisma.PrismaClientKnownRequestError) {
      console.error('Error en las validaciones del formulario.', error.code, error.message);
      if (error.code === "P2002") {
        return {
          success: false,
            error: "Ya existe una cuenta con este correo electrónico.",
        };
      }
    }

    /*console.error("Sign Up Error: ", error.constructor.name);
    console.error(JSON.stringify(error, null, 2));
    */
    return {
      success: false,
      error: "Ha ocurrido un error inesperado al crear la cuenta.",
    }


  }

}