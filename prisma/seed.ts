import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mini-erp.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@mini-erp.local",
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Usuário admin:", admin.email, "senha: admin123");
}

main().finally(() => prisma.$disconnect());
