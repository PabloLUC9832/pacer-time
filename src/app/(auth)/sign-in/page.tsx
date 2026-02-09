import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

import {SignInForm} from "@/components/auth/sign-in/SignInForm";
import {Metadata} from "next";
import {strings} from "@/constans/strings";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: strings.pages.signIn,
}

const Page = async () => {

  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="bg-background dark:bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/logo.svg"
            width={80}
            height={80}
            className='hidden md:block'
            alt="Pacer Time"
          />
        </Link>
        <SignInForm />
      </div>
    </div>
  )

}

export default Page;