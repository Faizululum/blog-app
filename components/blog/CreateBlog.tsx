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

const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.string().min(1, { message: "Image is required" }),
});

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
]

const CreateBlog = ({
  user,
}: Readonly<{
  user: CreateBlogProps;
}>) => {
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
        <Button>Publish</Button>
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
          <div className="flex items-center">
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
                  <div className="flex gap-2 items-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                    <span className="text-[12px]">Add Cover Image</span>
                  </div>
                )
               }}
               appearance={{ 
                  allowedContent: {
                    display: "none",
                  }
                }}
                className="mt-4 ut:button:bg-black ut-button:ut-readying:bg-black"
            />
            <Toaster richColors />
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBlog;
