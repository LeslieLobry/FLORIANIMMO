
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");

require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const email = (
      await rl.question("Email administrateur : ")
    ).trim().toLowerCase();

    const name = (
      await rl.question("Nom administrateur : ")
    ).trim();

    const password = await rl.question(
      "Mot de passe provisoire (visible pendant la saisie) : "
    );

    if (
      !email.includes("@") ||
      password.length < 12
    ) {
      throw new Error(
        "Email invalide ou mot de passe de moins de 12 caractères."
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error(
        "Ce compte existe déjà. Aucun mot de passe n'a été modifié."
      );
    }

    await prisma.adminUser.create({
      data: {
        email,
        name: name || "Administrateur",
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("Compte administrateur créé avec succès !");
  } finally {
    rl.close();
  }
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  