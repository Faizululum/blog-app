import { cookies } from "next/headers";
import Header from "./Header"
import { verifyAuth } from "@/lib/auth";

const CommonLayout = async ({children}: Readonly<{
    children: React.ReactNode
}>) => {
  const token = (await cookies()).get("token")?.value;
  const user = token ? await verifyAuth(token) : null;

  return (
    <div className="min-h-screen bg-white">
      {user && <Header />}
        {children}
    </div>
  )
}

export default CommonLayout