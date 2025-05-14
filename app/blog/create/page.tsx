import CreateBlog from "@/components/blog/CreateBlog"
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CreateBlogProps {
  userName: string;
  email: string;
  userId: string;
}

const CreateBlogPage = async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      redirect("/login");
    }
    const user = await verifyAuth(token) as CreateBlogProps;
    if (!user) {
      redirect("/login");
    }

  return (
    <div>
        <CreateBlog user={user} />
    </div>
  )
}

export default CreateBlogPage