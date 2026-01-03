"use client";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useState} from "react";
import * as XLSX from 'xlsx';
import {Runner} from "../../generated/prisma/client";
import {createBulksRunners, RunnerProps} from "@/lib/actions/runners.actions";

export default function DataTable({runners}: {runners: Runner[]}) {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  console.log('myFile: ', file);

  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, {type: "binary"});
          //SheetName
          const sheetName = workbook.SheetNames[0];
          //Worksheet
          const worksheet = workbook.Sheets[sheetName];
          //Json Data
          const jsonRunners = XLSX.utils.sheet_to_json(worksheet);

          /*for (const runner of jsonRunners) {
            if ("Bib" in runner) {
              runner.bib = runner["Bib"];
              delete runner["Bib"];
            }
            if ("Competidor" in runner) {
              runner.name = runner["Competidor"];
              delete runner["Competidor"];
            }
            if ("Posición" in runner) {
              runner.position = runner["Posición"];
              delete runner["Posición"];
            }
          }*/
          const normalizedRunners = jsonRunners.map(
              ({
                 Bib,
                 Competidor,
                 "Posición": Posición,
                 Laps,
                 "Distancia acumulada": DistanciaAcumulada,
                 Categoria,
                 Rama,
                 Club,
                 ...rest
               }) => ({
                bib: Bib,
                name: Competidor,
                position: Posición,
                laps: Laps,
                distance: DistanciaAcumulada,
                category: Categoria,
                branch: Rama,
                club: Club,
                ...rest
              })
          );


          console.log('jsonData nn: ', normalizedRunners);
          setJsonData(JSON.stringify(normalizedRunners, null, 2));
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  function saveData() {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, {type: "binary"});
          //SheetName
          const sheetName = workbook.SheetNames[0];
          //Worksheet
          const worksheet = workbook.Sheets[sheetName];
          //Json Data
          const jsonRunners = XLSX.utils.sheet_to_json(worksheet);

          const normalizedRunners = jsonRunners.map(
              ({
                 Bib,
                 Competidor,
                 "Posición": Posición,
                 Laps,
                 "Distancia acumulada": DistanciaAcumulada,
                 Categoria,
                 Rama,
                 Club,
                 ...rest
               }) => ({
                bib: Bib,
                name: Competidor,
                position: Posición,
                laps: Laps,
                distance: DistanciaAcumulada,
                category: Categoria,
                branch: Rama,
                club: Club,
                ...rest
              })
          );

          setJsonData(JSON.stringify(normalizedRunners, null, 2));
          console.log('jsonData: ', jsonData);
          //Save data to a database
          try {
            //console.log('createBulkRunners: ', json);
            await createBulksRunners(normalizedRunners);
            setLoading(true);
          } catch (error) {
            console.log('erros[createBulkRunners]', error);
          }

        }
      }
      reader.readAsArrayBuffer(file);
    }
  }


  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="myFile">Archivo</Label>
          <Input
            id="file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setFile(e.target.files && e.target.files[0])}
          />
        </div>
        <Button onClick={previewData}>Preview data</Button>
        <Button onClick={saveData}>Save data</Button>
        <Button>Clear data</Button>
      </div>
      <pre className="bg-background dark:bg-background-dark p-4 rounded-md">{jsonData}</pre>
      { loading ?  (
       <p>Saving ...</p>
      ) : (
        <div className="relative overflow-x-auto">
          { (runners && runners.length > 0) && (
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">BIB</TableHead>
                  <TableHead>Competidor</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead className="text-right">Rama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runners.map((runner: Runner) => (
                    <TableRow key={runner.id}>
                      <TableCell className="font-medium">{runner.bib}</TableCell>
                      <TableCell>{runner.name}</TableCell>
                      <TableCell>{runner.position}</TableCell>
                      <TableCell className="text-right">{runner.branch}</TableCell>
                    </TableRow>
                ))}

              </TableBody>
            </Table>
          )}
        </div>
      )}


    </div>
  )
}