import { Metadata } from "next";
import { strings } from "@/constans/strings";
import { Card, CardContent } from "@/components/ui/card";
import { getUserById } from "@/lib/actions/user.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditUserClient from "@/components/users/EditUserClient";

export const metadata: Metadata = {
  title: strings.pages.editUser,
};

export default async function UserEditPage({ params }: { params: { id: string } }) {
  const result = await getUserById(params.id);

  if (!result.success || !result.data) {
    return (
      <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-2xl flex-col gap-4 items-center text-center">
          <p className="text-red-600 font-medium">
            {result.error ?? "Usuario no encontrado"}
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/users">Regresar a la lista</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Convertir null → undefined para compatibilidad con el schema de Zod
  const { data } = result;
  const defaultValues = {
    ...data,
    motherLastName: data.motherLastName ?? undefined,
    eventName: data.eventName ?? undefined,
    phoneNumber: data.phoneNumber ?? undefined,
    country: data.country ?? undefined,
  };

  return (
    <div className="bg-background dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Card className="bg-surface dark:bg-surface">
          <CardContent>
            <EditUserClient defaultValues={defaultValues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}