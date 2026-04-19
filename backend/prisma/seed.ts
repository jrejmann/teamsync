import prisma from "../src/lib/prisma";

async function clearDb() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
}

async function main() {
  await clearDb();

  console.log("Seeding Database...");

  const project = await prisma.project.create({
    data: {
      name: "Projekt Testowy",
      tasks: {
        create: [
          { title: "Zrobić zakupy", status: "TODO" },
          { title: "Nauczyć się Prismy", status: "IN_PROGRESS" },
          { title: "Zjeść obiad", status: "DONE" },
        ],
      },
    },
  });

  console.log({ project });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
