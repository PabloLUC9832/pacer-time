"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserForm from "@/components/users/UserForm";
import { UpdateUserFormData } from "@/lib/validations/user.schema";
import { signUp } from "@/lib/actions/auth.actions";

export default function CreateUserClient() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(data: UpdateUserFormData) {
    setGeneralError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const result = await signUp(formData);

    if (result.success) {
      toast.success("Usuario creado correctamente");
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
      mode="create"
      onSubmit={handleSubmit}
      generalError={generalError}
    />
  );
}