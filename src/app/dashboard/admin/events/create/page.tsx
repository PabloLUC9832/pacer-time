import {Metadata} from "next";
import {strings} from "@/constans/strings";
import {Card, CardContent} from "@/components/ui/card";
import CreateEventClient from "@/components/events/CreateEventClient";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: strings.pages.createEvent,
};

export default async function EventsPage() {

  const session = await auth()

  return (
    <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="bg-surface dark:bg-surface">
            <CardContent>
              <CreateEventClient userId={session?.user.id ?? ""}/>
            </CardContent>
        </Card>
      </div>
    </div>
  );

}