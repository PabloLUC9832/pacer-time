import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {SignOut} from "@/components/sign-out";
import {Metadata} from "next";
import {strings} from "@/constans/strings";

export const metadata: Metadata = {
  title: {
    template: `%s | ${strings.appName}`,
    default: `${strings.appName}`
  },
  description: `${strings.pages.home} | ${strings.appName}`
}

export default async function Home() {

  /*
  const session = await auth()
  if (!session) redirect("/sign-in")
  */
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {/*<p className="text-gray-600">{session.user?.name}</p>*/}
        </div>

        <SignOut />

      </main>
    </div>
  );
}
