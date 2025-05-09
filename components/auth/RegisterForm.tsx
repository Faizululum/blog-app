"use client";

import { LockIcon, MailIcon, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form>
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 mt-2 h-5 w-5 text-gray-400" />
          <Input
            {...register("name")}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Username"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <MailIcon className="absolute left-3 mt-2 h-5 w-5 text-gray-400" />
          <Input
            {...register("email")}
            type="email"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email"
          />
        </div>
        <div className="relative">
          <LockIcon className="absolute left-3 mt-2 h-5 w-5 text-gray-400" />
          <Input
            {...register("password")}
            type="password"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password"
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="mt-3 w-full hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-101 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
