"use server";

import {ActionResponse, signInSchema, signUpSchema} from "@/lib/validations/auth.schema";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "../../../generated/prisma/client";
import {strings} from "@/constans/strings";
import {auth, signIn as nextAuthSignIn} from "@/lib/auth";
import {AuthError} from "next-auth";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {redirect} from "next/navigation";

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

    /*console.error("Sign Up Error: ", error.constructor.name);
    console.error(JSON.stringify(error, null, 2));
    */
    return {
      success: false,
      error: strings.auth.signUp.error,
    }

  }

}

export async function signIn(formData: FormData): Promise<ActionResponse> {

  try {

    const rawData ={
      email: formData.get('email'),
      password: formData.get('password'),
    }

    //console.log('rawData: ', rawData);

    const validatedData = signInSchema.parse(rawData);

    await nextAuthSignIn("credentials", {
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      redirect: false,
    });

    //revalidatePath("/", "layout");
    //redirect("/");

    return {
      success: true,
    }

  } catch (error) {
    console.error("SignIn Error: ", error);

    if (error instanceof z.ZodError) {

      console.error('Error en las validaciones del formulario: ',error.issues);

      return {
        success: false,
        error: strings.auth.fields.checkFields,
        fieldErrors: z.flattenError(error).fieldErrors,
      }
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        error: strings.auth.signIn.error,
      }
    }

    return {
      success: false,
      error: strings.auth.signIn.error,
    }

  }

}