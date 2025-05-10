"use server";

import aj from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import { z } from "zod";
import bcrypt from "bcryptjs";

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

export async function registerUserAction(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedData = schema.safeParse({ name, email, password });

  if (!validatedData.success) {
    return {
      error: validatedData.error.errors[0].message,
      status: 400,
    };
  }

  const { name: validName, email: validEmail, password: validPassword } = validatedData.data;

  try {
    const req = await request();
    const decision = await aj.protect(req, { email: validEmail });

    console.log(decision, "decision");

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        const emailTypes = decision.reason.emailTypes;
        if (emailTypes.includes("DISPOSABLE")) {
          return { error: "Disposable email addresses are not allowed", status: 403 };
        } else if (emailTypes.includes("FREE")) {
          return { error: "Free email addresses are not allowed", status: 403 };
        } else if (emailTypes.includes("INVALID")) {
          return { error: "Invalid email addresses are not allowed", status: 403 };
        } else if (emailTypes.includes("NO_MX_RECORDS")) {
          return { error: "No MX records found for email", status: 403 };
        } else {
          return { error: "Email verification failed", status: 403 };
        }
      } else if (decision.reason.isBot()) {
        return { error: "Bots are not allowed", status: 403 };
      } else if (decision.reason.isRateLimit()) {
        return { error: "Too many requests. Please try again later.", status: 403 };
      } else {
        return { error: "Request denied", status: 403 };
      }
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: validEmail });
    if (existingUser) {
      return {
        error: "Email already exists",
        status: 400,
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validPassword, salt);

    const newUser = new User({
      name: validName,
      email: validEmail,
      password: hashedPassword,
    });

    const result = await newUser.save();

    if (result) {
      return {
        success: "Registration successful",
        status: 201,
      };
    } else {
      return {
        error: "Something went wrong",
        status: 500,
      };
    }

  } catch (error) {
    console.log(error);
    return {
      error: "Internal server error",
      status: 500,
    };
  }
}
