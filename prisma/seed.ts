// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",

      // This is just for demonstration
    },
  });

  // Create some example rooms
  await prisma.room.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Studienraum A101",
        location: "Hauptgebäude",
        size: 30,
        hasBeamer: true,
        hasWhiteboard: true,
      },
      {
        name: "Gruppenraum B202",
        location: "Bibliothek",
        size: 15,
        hasBeamer: false,
        hasWhiteboard: true,
      },
      {
        name: "MINT-Labor M303",
        location: "MINT-Zentrum",
        size: 40,
        hasBeamer: true,
        hasWhiteboard: true,
      },
      {
        name: "Seminarraum G105",
        location: "Geisteswissenschaftliches Zentrum",
        size: 25,
        hasBeamer: true,
        hasWhiteboard: false,
      },
      {
        name: "Gruppenraum B110",
        location: "Bibliothek",
        size: 10,
        hasBeamer: false,
        hasWhiteboard: true,
      },
      {
        name: "Präsentationsraum A201",
        location: "Hauptgebäude",
        size: 35,
        hasBeamer: true,
        hasWhiteboard: true,
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
