"use server";

import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

interface RegisterUser {
    name: string;
    email: string;
    password: string;
}

export async function registerUserAction(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
  
    // Validasi jika ada yang null
    if (!name || !email || !password) {
      return {
        error: "Missing fields",
        status: 400,
      };
    }
  
    // Cek type
    const parsed: RegisterUser = {
      name: String(name),
      email: String(email),
      password: String(password),
    };
  
    const validatedData = schema.safeParse(parsed);
  
    if (!validatedData.success) {
      return {
        error: validatedData.error.errors[0].message,
        status: 400,
      };
    }
  
    const { name: validName, email: validEmail, password: validPassword } = validatedData.data;
  
    try {
      const req = await request();
      const decision = await aj.protect(req, {
        email: validEmail,
      });
  
      console.log(decision, "decision");
  
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return {
        message: "Something went wrong",
        status: 500,
      };
    }
  }
  