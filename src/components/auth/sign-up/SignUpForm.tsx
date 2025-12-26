import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {strings} from "@/constans/strings";
import SignUpFormFields from "@/components/auth/sign-up/SignUpFormFields";

export async function  SignUpForm({
                             className,
                             ...props
                           }: React.ComponentProps<"div">) {

  const session = await auth();
  if (session) redirect("/")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{strings.login.signUp}</CardTitle>
          <CardDescription>
            {strings.login.signUpInstructions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpFormFields />
        </CardContent>
      </Card>
    </div>
  )
}