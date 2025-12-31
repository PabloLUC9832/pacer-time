import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SignInFormFields from "@/components/auth/sign-in/SignInFormFields";
import {strings} from "@/constans/strings";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-surface dark:bg-surface">
        <CardHeader>
          <CardTitle>{strings.auth.signIn.title}</CardTitle>
          <CardDescription>
            {strings.auth.signIn.instructions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInFormFields />
        </CardContent>
      </Card>
    </div>
  )
}
