import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.string().min(1, { message: "Image is required" }),
});

export async function createBlogPostAction(data: z.infer<typeof blogPostSchema>, headersList?: Headers) {
  const headersToUse = headersList || await headers();
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token!);

  if (!user) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  const validateFields = blogPostSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      error: validateFields.error.errors[0].message,
      status: 400,
    };
  }

  const { title, content, category, coverImage } = validateFields.data;

  try {
    // ✅ Fix: Build Request manually for Arcjet
    const req = new Request("https://test/api/create-blog-post", {
      method: "POST",
      headers: headersToUse,
      body: JSON.stringify(data),
    });

    const decision = await blogPostRules.protect(req);

    if (decision.isErrored()) {
      return {
        error: "An internal error occurred with Arcjet.",
        status: 500,
      };
    }

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return {
          error: "Request blocked by Arcjet Shield. Suspicious activity detected.",
          status: 403,
        };
      }

      if (decision.reason.isBot()) {
        return {
          error: "Request blocked. Bot-like behavior detected.",
          status: 403,
        };
      }

      return {
        error: "Request blocked by Arcjet.",
        status: 403,
      };
    }

    await connectToDatabase();
    const post = new BlogPost({
      title,
      content,
      author: user.userId,
      category,
      coverImage,
      comments: [],
      upvotes: [],
    });

    await post.save();
    revalidatePath("/");

    return {
      success: true,
      post,
    };
  } catch {
    return {
      error: "Something went wrong while creating the blog post.",
      status: 500,
    };
  }
}