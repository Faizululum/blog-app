"use client";

import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UploadButton } from "../general/UploadThingReexported";
import { PlusCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./quill-custom.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.string().min(1, { message: "Image is required" }),
});

const ReactQuill = dynamic(()=> import("react-quill-new"), { ssr: false });

interface CreateBlogProps {
  userName: string;
  email: string;
  userId: string;
}

const BLOG_CATEGORIES = [
    {key: "technology", value: "Technology"},
    {key: "business", value: "Business"},
    {key: "lifestyle", value: "Lifestyle"},
    {key: "entertainment", value: "Entertainment"},
    {key: "programming", value: "Programming"},
    {key: "webDevelopment", value: "Web Development"},
];

const isSuspiciousContent = (data: z.infer<typeof blogPostSchema>) => {
  const suspiciousPatterns = [
    /<script>/i,
    /javascript/i,
    /onload=/i,
    /onclick=/i,
    /'.*OR.*'/i,
    /UNION SELECT/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(data.content));
}

const CreateBlog = ({
  user,
}: Readonly<{
  user: CreateBlogProps;
}>) => {
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      coverImage: "",
    },
    resolver: zodResolver(blogPostSchema),
  });

  const title = watch("title");
  const category = watch("category");
  const content = watch("content");
  const coverImage = watch("coverImage");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const onBlogSubmit = async (data: z.infer<typeof blogPostSchema>) => {
    setIsLoading(true);
    try {
      const isSuspiciousInput = isSuspiciousContent(data);

      const result = await fetch("/api/create-blog-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-arcjet-suspicious": isSuspiciousInput.toString(),
        },
        body: JSON.stringify(data),
      }).then(res => res.json());

      if (result.success) {
        toast.success("Blog post created successfully");
        router.push("/");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setQuillLoaded(true);
  }, []);

  const isBtnDisabled = () => {
    return title === "" || content === "" || category === "" || coverImage === "";    
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>TF</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.userName}</p>
          </div>
        </div>
        <Button disabled={isBtnDisabled() || isLoading} onClick={handleSubmit(onBlogSubmit)}>Publish</Button>
      </header>
      <main>
        <form>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Title"
                className="text-4xl font-bold border-none outline-none mb-4 p-0 focus-visible:ring-0"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
          )}
          <Controller 
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {BLOG_CATEGORIES.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                            {category.value}
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex items-center mb-6">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setValue("coverImage", res[0].url);
                  toast.success("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`${error}`);
              }}
              content={{ 
                button : (
                  <div className="px-2 flex gap-2 items-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                    <span className="text-[12px]">Add Cover Image</span>
                  </div>
                )
               }}
               appearance={{ 
                  allowedContent: {
                    display: "none",
                  },
                  button: "ut-ready:bg-black-500 ut-uploading:cursor-not-allowed rounded-r-none bg-black-900 bg-none after:bg-black-400",
                  container: "mt-4 w-max flex-row rounded-md border-cyan-300 bg-slate-800"
                }}
            />
            <Toaster richColors />
          </div>
          {
            quillLoaded && 
            <Controller 
              name="content"
              control={control}
              render={({ field }) => {

                return (
                  <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    modules={modules}
                    {...field}
                    onChange={(content) => field.onChange(content)}
                    placeholder="Write your blog here"
                    className="quill-editor"
                  />
                )
              }}
            />
          }
        </form>
      </main>
    </div>
  );
};

export default CreateBlog;
