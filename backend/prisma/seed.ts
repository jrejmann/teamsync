import prisma from "../src/lib/prisma";

type ProjectRow = { id: number; code: string; name: string };
type TaskRow = { id: number; title: string };

async function clearDb() {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
}

async function main() {
  await clearDb();

  console.log("Seeding Database...");

  await prisma.project.createMany({
    data: [
      {
        name: "TeamSync — aplikacja webowa",
        code: "WEBAPP",
      },
      {
        name: "Integracje i synchronizacja",
        code: "INTEG",
      },
      {
        name: "TeamSync Mobile (iOS)",
        code: "IOSAPP",
      },
      {
        name: "Infra · CI i obserwowalność",
        code: "INFRA",
      },
    ],
  });

  const projects = await prisma.project.findMany({
    orderBy: { code: "asc" },
  });

  const byCode = Object.fromEntries(
    projects.map((p: ProjectRow) => [p.code, p]),
  ) as Record<string, ProjectRow>;

  await prisma.task.createMany({
    data: [
      {
        projectId: byCode.WEBAPP.id,
        title: "Board kanban — drag & drop między kolumnami",
        status: "IN_PROGRESS",
      },
      {
        projectId: byCode.WEBAPP.id,
        title: "Lista projektów z filtrem po kodzie i nazwie",
        status: "IN_PROGRESS",
      },
      {
        projectId: byCode.WEBAPP.id,
        title: "Widok szczegółów taska — komentarze i historia",
        status: "DONE",
      },
      {
        projectId: byCode.WEBAPP.id,
        title: "Tryb offline / optimistic UI przy zapisie komentarza",
        status: "TODO",
      },
      {
        projectId: byCode.INTEG.id,
        title: "Webhook Slack — powiadomienia o nowych komentarzach",
        status: "TODO",
      },
      {
        projectId: byCode.INTEG.id,
        title: "Import członków zespołu z Google Workspace",
        status: "IN_PROGRESS",
      },
      {
        projectId: byCode.INTEG.id,
        title: "Rate limiting i replay protection dla publicznego API",
        status: "TODO",
      },
      {
        projectId: byCode.IOSAPP.id,
        title: "Lista tasków zsynchronizowana z REST API",
        status: "IN_PROGRESS",
      },
      {
        projectId: byCode.IOSAPP.id,
        title: "Push notifications dla @wzmianki w komentarzu",
        status: "TODO",
      },
      {
        projectId: byCode.IOSAPP.id,
        title: "Ekran dodawania komentarza z walidacją offline",
        status: "DONE",
      },
      {
        projectId: byCode.INFRA.id,
        title: "Pipeline GitHub Actions — lint, test, deploy staging",
        status: "DONE",
      },
      {
        projectId: byCode.INFRA.id,
        title: "Health checks /ready dla Postgres w Kubernetes",
        status: "IN_PROGRESS",
      },
      {
        projectId: byCode.INFRA.id,
        title: "Backup bazy dzienny + retention 14 dni",
        status: "TODO",
      },
    ],
  });

  const tasks = await prisma.task.findMany({
    select: { id: true, title: true },
  });

  const taskByTitlePrefix = (prefix: string) =>
    tasks.find((t: TaskRow) => t.title.startsWith(prefix));

  const c = {
    kanban: taskByTitlePrefix("Board kanban"),
    details: taskByTitlePrefix("Widok szczegółów taska"),
    slack: taskByTitlePrefix("Webhook Slack"),
    google: taskByTitlePrefix("Import członków"),
    iosSync: taskByTitlePrefix("Lista tasków zsynchronizowana"),
    push: taskByTitlePrefix("Push notifications"),
    iosComment: taskByTitlePrefix("Ekran dodawania komentarza"),
    staging: taskByTitlePrefix("Pipeline GitHub Actions"),
    k8s: taskByTitlePrefix("Health checks"),
  };

  await prisma.comment.createMany({
    data: [
      {
        taskId: c.kanban!.id,
        content:
          "Na stagingu UX jest OK — na dużych boardach z 200+ kartami warto rozważyć virtualizację listy.",
      },
      {
        taskId: c.kanban!.id,
        content:
          "Designer wrzucił zmiany w Figma (v3). Blokujemy merge do maina aż przejdzie review z dostępnością.",
      },
      {
        taskId: c.details!.id,
        content:
          "Shipnięte w v0.9. Zespół supportu potwierdził, że markdown w komentarzach działa na Safari i Chrome.",
      },
      {
        taskId: c.slack!.id,
        content:
          "Product chce payload z linkiem bezpośrednio do taska i skrótem tytułu (max 80 znaków).",
      },
      {
        taskId: c.google!.id,
        content:
          "OAuth scope już zaakceptowany przez security — czekamy na klucze od IT w środę.",
      },
      {
        taskId: c.google!.id,
        content:
          "Uwaga: import grup vs pojedynczych użytkowników — na pierwszy release bierzemy tylko grupy.",
      },
      {
        taskId: c.iosSync!.id,
        content:
          "Pull-to-refresh działa; przy błędzie 503 pokazujemy toast z retry — zgodnie z ustaleniami.",
      },
      {
        taskId: c.push!.id,
        content:
          "Do rozstrzygnięcia: czy batchować powiadomienia co 30 s czy wysyłać każde osobno (koszt APNs).",
      },
      {
        taskId: c.iosComment!.id,
        content:
          "QA iOS 17 / 18 — brak crashy. Gotowe do oznaczenia jako done w sprint review.",
      },
      {
        taskId: c.staging!.id,
        content:
          "Ostatni deploy na staging trwał 4m20s — acceptable. Monitorujemy czas kroku prisma migrate.",
      },
      {
        taskId: c.k8s!.id,
        content:
          "Probe /health/ready już patrzy na SELECT 1 — następny krok: alert w PagerDuty przy 2 kolejnych 503.",
      },
    ],
  });

  const counts = await prisma.$transaction([
    prisma.project.count(),
    prisma.task.count(),
    prisma.comment.count(),
  ]);

  console.log({
    projects: counts[0],
    tasks: counts[1],
    comments: counts[2],
  });
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
