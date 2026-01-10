import { PrismaClient, Prisma, User } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const users = [
    {
      name: "John Doe",
      age: 32,
      address: "Berlin, Germany",
      phone: "2222",
      email: "john.doe@gmail.com",
      twitter: "@johndoe",
      isDev: true,
      createdAt: new Date("2023-01-15"),
      birthdate: new Date("1992-03-12"),
    },
    {
      name: "Maria Santos",
      age: 27,
      address: "Lisbon, Portugal",
      phone: "+351 912 345 678",
      email: "maria.santos@gmail.com",
      twitter: "@mariasantos",
      isDev: false,
      createdAt: new Date("2023-06-10"),
      birthdate: new Date("1997-08-22"),
    },
    {
      name: "Lucas Martin",
      age: 41,
      address: "Paris, France",
      phone: "+33 6 12 34 56 78",
      email: "lucas.martin@gmail.com",
      twitter: "@lucasm",
      isDev: true,
      createdAt: new Date("2022-11-05"),
      birthdate: new Date("1983-01-30"),
    },
    {
      name: "Anna Kowalski",
      age: 29,
      address: "Warsaw, Poland",
      phone: "+48 501 234 567",
      email: "anna.k@gmail.com",
      twitter: "@annak",
      isDev: false,
      createdAt: new Date("2023-03-18"),
      birthdate: new Date("1995-05-14"),
    },
    {
      name: "Marco Rossi",
      age: 36,
      address: "Milan, Italy",
      phone: "+39 333 456 789",
      email: "marco.rossi@gmail.com",
      twitter: "@marcorossi",
      isDev: true,
      createdAt: new Date("2021-09-01"),
      birthdate: new Date("1988-09-09"),
    },
    {
      name: "Sofia Ivanova",
      age: 24,
      address: "Sofia, Bulgaria",
      phone: "+359 88 123 4567",
      email: "sofia.ivanova@gmail.com",
      twitter: "@sofiaiv",
      isDev: false,
      createdAt: new Date("2024-02-02"),
      birthdate: new Date("2000-11-03"),
    },
    {
      name: "David Brown",
      age: 45,
      address: "London, UK",
      phone: "+44 7700 900123",
      email: "david.brown@gmail.com",
      twitter: "@davidb",
      isDev: true,
      createdAt: new Date("2020-07-20"),
      birthdate: new Date("1979-04-18"),
    },
    {
      name: "Emma Wilson",
      age: 31,
      address: "Manchester, UK",
      phone: "+44 7700 800456",
      email: "emma.wilson@gmail.com",
      twitter: "@emmaw",
      isDev: false,
      createdAt: new Date("2022-12-12"),
      birthdate: new Date("1993-06-25"),
    },
    {
      name: "Noah Schmidt",
      age: 38,
      address: "Munich, Germany",
      phone: "+49 176 987654",
      email: "noah.schmidt@gmail.com",
      twitter: "@noahs",
      isDev: true,
      createdAt: new Date("2021-04-08"),
      birthdate: new Date("1986-10-07"),
    },
    {
      name: "Lena Meyer",
      age: 26,
      address: "Hamburg, Germany",
      phone: "+49 171 654321",
      email: "lena.meyer@gmail.com",
      twitter: "@lenam",
      isDev: false,
      createdAt: new Date("2024-01-05"),
      birthdate: new Date("1998-12-19"),
    },

    // generated 40 dummy users
    ...Array.from({ length: 40 }).map((_, i) => {
      const age = 20 + (i % 30);
      const birthYear = new Date().getFullYear() - age;
      const month = String((i % 12) + 1).padStart(2, "0");
      const day = String((i % 28) + 1).padStart(2, "0");

      return {
        name: `User${i + 11} Test${i + 11}`,
        age,
        address: `City ${i + 1}, Europe`,
        phone: `+00 123 45${i.toString().padStart(3, "0")}`,
        email: `user${i + 11}@example.com`,
        twitter: `@user${i + 11}`,
        isDev: i % 2 === 0,
        createdAt: new Date(`${2020 + (i % 5)}-${month}-${day}`),
        birthdate: new Date(`${birthYear}-${month}-${day}`),
      };
    }),
  ];

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
