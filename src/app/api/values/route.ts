import prisma from "@/lib/prisma";
import { valueToString } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { field, type } = await req.json();

  const result = await prisma.user.findMany({
    select: {
      [field]: true,
    },
  });

  const values: string[] = result.map((item) => valueToString(item[field]));

  return NextResponse.json(values);
}
