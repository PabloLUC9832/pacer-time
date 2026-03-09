"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserForm from "@/components/users/UserForm";
import { UpdateUserFormData } from "@/lib/validations/user.schema";
import { updateUser } from "@/lib/actions/user.actions";

type Props = {
  defaultValues: Partial<UpdateUserFormData>;
};

export default function EditUserClient({ defaultValues }: Props) {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(data: UpdateUserFormData) {
    setGeneralError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const result = await updateUser(formData);

    if (result.success) {
      toast.success("Usuario actualizado correctamente");
      router.push("/dashboard/admin/users");
    } else {
      if (result.error) {
        setGeneralError(result.error);
        toast.error(result.error);
      }
    }
  }

  return (
    <UserForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      generalError={generalError}
    />
  );
}