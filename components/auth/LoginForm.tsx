"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "../ui/input";
import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "../ui/button";
import { loginUserAction } from "@/actions/login";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm({
    resolver: zodResolver(schema),
  });

  interface LoginUser {
    email: string;
    password: string;
  }

  const onSubmit = async (data: LoginUser) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key as keyof LoginUser]);
      });
      const result = await loginUserAction(formData);
      console.log(result, "result");
      if (result?.status === 200 || result?.status === 201) {
        toast.success("Login successfully");
        router.push("/");
      } else {
        throw new Error(result?.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
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
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-3 w-full hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-101 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </Button>
      <Toaster richColors />
    </form>
  );
};

export default LoginForm;