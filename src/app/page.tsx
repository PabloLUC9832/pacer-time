import {Metadata} from "next";
import {strings} from "@/constans/strings";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: strings.pages.home,
}

export default async function Home() {

  const session = await auth();

  //console.log('session::', session)

  return (

    <div className="min-h-screen">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="rounded-lg p-8 shadow-sm bg-surface dark:bg-surface">

        </div>
      </div>
    </div>

  );
}
