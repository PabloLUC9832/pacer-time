import {SignUpForm} from "@/components/auth/sign-up/SignUpForm";
import Link from "next/link";
import {Metadata} from "next";
import {strings} from "@/constans/strings";
import Image from "next/image";

export const metadata: Metadata = {
  title: strings.pages.signUp,
}

export default function Page() {
  return (
      <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
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
          <SignUpForm />
        </div>
      </div>
  )
}
