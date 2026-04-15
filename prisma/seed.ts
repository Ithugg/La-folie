import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create 3 admin DJ/founder accounts
  const admins = [
    {
      name: "Ismail",
      email: "ismail.elktiri02@gmail.com",
      password: "Admin123!",
    },
    {
      name: "Zouhair",
      email: "zabadanmusic@gmail.com",
      password: "Admin123!",
    },
    {
      name: "Souhail",
      email: "souhail@lafolie.club",
      password: "Admin123!",
    },
  ];

  for (const admin of admins) {
    const hashedPassword = await hash(admin.password, 12);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        name: admin.name,
        email: admin.email,
        hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    console.log(`Created admin: ${admin.name} (${admin.email})`);
  }

  // Create sample referral codes for each admin
  const adminUsers = await prisma.user.findMany({ where: { role: "ADMIN" } });

  for (const admin of adminUsers) {
    await prisma.referralCode.create({
      data: {
        code: `FOLIE-${admin.name.toUpperCase()}`,
        createdById: admin.id,
        maxUses: 50,
        isActive: true,
      },
    });
    console.log(`Created referral code for ${admin.name}`);
  }

  // Create sample events
  const sampleEvents = [
    {
      title: "La Folie: Opening Night",
      slug: "opening-night",
      description:
        "The inaugural night of La Folie. An exclusive evening of underground electronic music, curated cocktails, and an atmosphere unlike anything you've experienced. Dress code: Black tie creative.",
      date: new Date("2026-05-15T22:00:00"),
      endDate: new Date("2026-05-16T05:00:00"),
      venue: "The Vault",
      address: "42 Rue de la Nuit, Paris",
      status: "PUBLISHED",
      featured: true,
      capacity: 200,
    },
    {
      title: "Neon Dreams",
      slug: "neon-dreams",
      description:
        "A night of hypnotic beats and luminous visuals. Three rooms, three vibes, one unforgettable experience. Limited to 150 souls.",
      date: new Date("2026-06-01T23:00:00"),
      endDate: new Date("2026-06-02T06:00:00"),
      venue: "Warehouse X",
      address: "88 Boulevard Industrial, Paris",
      status: "PUBLISHED",
      featured: false,
      capacity: 150,
    },
    {
      title: "Phantom Session",
      slug: "phantom-session",
      description:
        "Location revealed 2 hours before the event. A secret session for the most devoted members. Expect the unexpected.",
      date: new Date("2026-06-20T00:00:00"),
      endDate: new Date("2026-06-20T06:00:00"),
      venue: "Secret Location",
      status: "DRAFT",
      featured: false,
      capacity: 100,
    },
  ];

  for (const event of sampleEvents) {
    const created = await prisma.event.create({ data: event });

    // Create ticket tiers for published events
    if (event.status === "PUBLISHED") {
      await prisma.ticketTier.createMany({
        data: [
          {
            eventId: created.id,
            name: "General",
            description: "Standard entry",
            price: 3500,
            currency: "EUR",
            quantity: Math.floor((event.capacity || 100) * 0.7),
            sortOrder: 0,
          },
          {
            eventId: created.id,
            name: "VIP",
            description: "Priority entry + welcome drink",
            price: 7500,
            currency: "EUR",
            quantity: Math.floor((event.capacity || 100) * 0.2),
            sortOrder: 1,
          },
          {
            eventId: created.id,
            name: "Table",
            description: "Reserved table for 4 + bottle service",
            price: 25000,
            currency: "EUR",
            quantity: Math.floor((event.capacity || 100) * 0.05),
            sortOrder: 2,
          },
        ],
      });
    }

    console.log(`Created event: ${event.title}`);
  }

  // Create a sample announcement
  await prisma.announcement.create({
    data: {
      title: "Welcome to La Folie",
      content:
        "The doors are opening. You've been chosen. Explore upcoming events and secure your place among the select few.",
      priority: "HIGH",
      isActive: true,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
