import {DataTable} from "@/components/users/data-table";
import prisma from "../../../../../lib/prisma";
import {columns} from "@/components/users/columns";

export default async function UsersPage() {

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null
    }
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );

}