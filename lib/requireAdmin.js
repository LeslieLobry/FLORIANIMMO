
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.user.role !== "ADMIN"
  ) {
    redirect("/admin/login");
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return session;
}
