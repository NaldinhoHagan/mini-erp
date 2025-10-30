import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";

export async function listClients(req: Request, res: Response) {
  const q = (req.query.q as string) || "";
  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { id: "desc" },
  });
  res.render("clients/index", { title: "Clientes", clients, q });
}

export async function getNewClient(req: Request, res: Response) {
  res.render("clients/new", { title: "Novo Cliente" });
}

export async function postNewClient(req: Request, res: Response) {
  const { name, email, phone } = req.body;
  await prisma.client.create({ data: { name, email, phone } });
  res.redirect("/clients");
}

export async function getEditClient(req: Request, res: Response) {
  const id = Number(req.params.id);
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) return res.status(404).send("Cliente não encontrado");
  res.render("clients/edit", { title: "Editar Cliente", client });
}

export async function postEditClient(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, email, phone } = req.body;
  await prisma.client.update({ where: { id }, data: { name, email, phone } });
  res.redirect("/clients");
}

export async function postDeleteClient(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.client.delete({ where: { id } });
  res.redirect("/clients");
}
