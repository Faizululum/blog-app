"use server";

import { loginRules } from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export async function loginUserAction(formData: FormData) {
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

  const { email: validEmail, password: validPassword } = validatedData.data;

  try {
    const req = await request();
    const decision = await loginRules.protect(req, { email: validEmail });

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
      } else if (decision.reason.isShield()) {
        return { error: "Suspicious activity detected", status: 403 };
      } else if (decision.reason.isRateLimit()) {
        return { error: "Too many requests", status: 403 };
      } else {
        return { error: "Request denied", status: 403 };
      }
    }

    await connectToDatabase();

    const user = await User.findOne({ email: validEmail }).select("+password");

    if (!user) {
      return { error: "Invalid credentials", status: 401 };
    }

    const isPasswordValid = await bcrypt.compare(validPassword, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid credentials", status: 401 };
    }

    const userToken = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      userName: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder()
      .encode(process.env.JWT_SECRET!));

      (await cookies()).set("token", userToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7200,
        path: "/",
      })

      return {
        success: "Login successful",
        status: 200,
      }

  } catch (error) {
    console.log(error, "Login error");
    return {
      error: "Internal server error",
      status: 500,
    };
  }
}