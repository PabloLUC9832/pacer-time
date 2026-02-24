import {Metadata} from "next";
import {strings} from "@/constans/strings";
import {Card, CardContent} from "@/components/ui/card";
import SignUpFormFields from "@/components/auth/sign-up/SignUpFormFields";

export const metadata: Metadata = {
  title: strings.pages.editUser,
}

export default function UserEditPage() {
  <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Card className="bg-surface dark:bg-surface">
        <CardContent>
          <SignUpFormFields />
        </CardContent>
      </Card>
    </div>
  </div>
}
