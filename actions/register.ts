"use server";

import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" }),
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
  
    const { email: validEmail } = validatedData.data;
  
    try {
      const req = await request();
      const decision = await aj.protect(req, {
        email: validEmail,
      });
  
      console.log(decision, "decision");

      if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
          const emailTypes = decision.reason.emailTypes;
          if (emailTypes.includes("DISPOSABLE")) {
            return {
              error: "Disposable email addresses are not allowed",
              status: 403,
            }
          } else if (emailTypes.includes("FREE")) {
            return {
              error: "Free email addresses are not allowed",
              status: 403,
            }
          } else if (emailTypes.includes("INVALID")) {
            return {
              error: "Invalid email addresses are not allowed",
              status: 403,
            }
          } else if (emailTypes.includes("NO_MX_RECORDS")) {
            return {
              error: "No MX records are not allowed",
              status: 403,
            }
          } else {
            return {
              error: "Invalid email address",
              status: 403,
            }
          }
        } else if (decision.reason.isBot()) {
          return {
            error: "Bots are not allowed",
            status: 403,
          }
        } else if (decision.reason.isRateLimit()) {
          return {
            error: "To many requests! Please try again later",
            status: 403,
          }
        } else {
          return {
            error: "Registration failed",
            status: 403,
          }
        }
      }
      return { status: 200 };

      // Database connection
      
    } catch (error) {
      console.log(error);
      return {
        message: "Something went wrong",
        status: 500,
      };
    }
  }
  