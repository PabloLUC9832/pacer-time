import {Metadata} from "next";
import {strings} from "@/constans/strings";
import SignUpFormFields from "@/components/auth/sign-up/SignUpFormFields";
import {Card, CardContent} from "@/components/ui/card";

export const metadata: Metadata = {
  title: strings.pages.createUsers,
}

export default function UsersPage() {

  return (
    <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="bg-surface dark:bg-surface">
          <CardContent>
            <SignUpFormFields isCreating={true}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );

}