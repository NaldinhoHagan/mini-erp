import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export async function getLogin(req: Request, res: Response) {
  res.render("auth/login", { title: "Login" });
}

export async function postLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.render("auth/login", { title: "Login", error: "Credenciais inválidas" });
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.render("auth/login", { title: "Login", error: "Credenciais inválidas" });
  (req.session as any).user = { id: user.id, name: user.name, role: user.role };
  res.redirect("/");
}

export async function postLogout(req: Request, res: Response) {
  req.session?.destroy(() => res.redirect("/login"));
}
