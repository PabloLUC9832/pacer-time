"use server";

import prisma from "../../../lib/prisma";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";

export type RunnerProps = {
  id: string;
  bib: string;
  name: string;
  position: number;
  laps: number;
  distance: string;
  category: string;
  branch: string;
  club: string;
}

export async function getRunners() {

  try {
    const runners = await prisma.runner.findMany();
    return runners;
  }  catch (error) {
    console.error(error);
  }

}

export async function createRunner(data: RunnerProps) {
  try {
    const runner = await prisma.runner.create({
      data: {
        bib: data.bib.toString(),
        name: data.name.toString(),
        position: data.position,
        laps: data.laps,
        distance: data.distance.toString(),
        category: data.category.toString(),
        branch: 'V',
        club: data.club.toString(),
      }
    });
    revalidatePath("/upload-runners");
    return runner;
  } catch (error) {
    console.log('[createRunner] error: ', error)
  }
}

export async function createBulksRunners(runners: RunnerProps[]) {
  try {

    for (const runner of runners) {
      console.log('user::', runner);
      await createRunner(runner);
    }

  } catch (error) {

  }
}