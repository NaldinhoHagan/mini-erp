import { prisma } from "../lib/prisma.js";
export async function listClients(req, res) {
    const q = req.query.q || "";
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
export async function getNewClient(req, res) {
    res.render("clients/new", { title: "Novo Cliente" });
}
export async function postNewClient(req, res) {
    const { name, email, phone } = req.body;
    await prisma.client.create({ data: { name, email, phone } });
    res.redirect("/clients");
}
export async function getEditClient(req, res) {
    const id = Number(req.params.id);
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client)
        return res.status(404).send("Cliente não encontrado");
    res.render("clients/edit", { title: "Editar Cliente", client });
}
export async function postEditClient(req, res) {
    const id = Number(req.params.id);
    const { name, email, phone } = req.body;
    await prisma.client.update({ where: { id }, data: { name, email, phone } });
    res.redirect("/clients");
}
export async function postDeleteClient(req, res) {
    const id = Number(req.params.id);
    await prisma.client.delete({ where: { id } });
    res.redirect("/clients");
}
