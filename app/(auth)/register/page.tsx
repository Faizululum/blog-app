import RegisterForm from "@/components/auth/RegisterForm";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const token = (await cookies()).get("token")?.value;
  
  if (token) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white rounded-lg p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Register
            </h1>
            <p className="text-gray-500 text-sm">
              Create your account to start publishing your articles.
            </p>
            <RegisterForm />
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <Link
                className="font-medium ml-1 text-blue-600 hover:text-blue-500"
                href="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-1/2 p-12 items-center justify-center relative">
        <div className="max-w-lg space-y-6 text-white z-10">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Join us to explore the best blog posts
          </h2>
          <p className="text-right text-lg text-black font-bold">- Faiz Blog</p>
        </div>
        <div className="absolute inset-0 bg-yellow-400"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
