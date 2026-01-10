import prisma from "@/lib/prisma";
import { buildUsersSQL } from "@/lib/users/user-query-builder";
import { UsersQueryOptions } from "@/types/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const options: UsersQueryOptions = await req.json();

  const sql = buildUsersSQL(options);

  const users = await prisma.$queryRawUnsafe(sql);

  return NextResponse.json(users);
}
