import { User } from "lucide-react"
import { Input } from "../ui/input"

const RegisterForm = () => {
  return (
    <form >
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input className="pl-10 bg-gray-50" />
        </div>
      </div>
    </form>
  )
}

export default RegisterForm