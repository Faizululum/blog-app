"use client"

import { Edit, LogOut, Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { logoutUserAction } from "@/actions/logout"

const Header = () => {
  const router = useRouter();
  async function handleLogout() {
    const result = await logoutUserAction();
    if (result.status === 200) {
      router.push("/login");
    } else {
      console.error(result.error);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold font-serif cursor-pointer tracking-tighter">
                <span className="">
                  Blog App
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Input 
                  placeholder="Search blogs..."
                  className="pl-10 pr-4 py-1 w-64 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
                />
                <Search 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <Button onClick={()=>router.push("/blog/create")} variant="ghost" size="icon" className="cursor-pointer">
                <Edit 
                  className="w-6 h-6"
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>TF</AvatarFallback>                    
                  </Avatar>                  
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    <span className="ml-2 text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header