import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

import {SignInForm} from "@/components/auth/sign-in/SignInForm";
import {Metadata} from "next";
import {strings} from "@/constans/strings";

export const metadata: Metadata = {
  title: strings.pages.signIn,
}

const Page = async () => {

  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )

}

export default Page;