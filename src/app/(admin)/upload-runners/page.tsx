import DataTable from "@/components/dataTable";
import {getRunners} from "@/lib/actions/runners.actions";

export default async function Page() {

  const runners = await getRunners();

  return (
    <DataTable runners = {runners || []}/>
  );
}