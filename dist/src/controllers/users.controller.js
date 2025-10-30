import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
export async function listUsers(req, res) {
    const q = req.query.q || "";
    const users = await prisma.user.findMany({
        where: q
            ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { email: { contains: q, mode: "insensitive" } },
                ],
            }
            : undefined,
        orderBy: { id: "desc" },
    });
    res.render("users/index", { title: "Usuários", users, q });
}
export async function getNewUser(req, res) {
    res.render("users/new", { title: "Novo Usuário" });
}
export async function postNewUser(req, res) {
    const { name, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: passwordHash, role } });
    res.redirect("/users");
}
export async function getEditUser(req, res) {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        return res.status(404).send("Usuário não encontrado");
    res.render("users/edit", { title: "Editar Usuário", user });
}
export async function postEditUser(req, res) {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;
    await prisma.user.update({ where: { id }, data: { name, email, role } });
    res.redirect("/users");
}
export async function postDeleteUser(req, res) {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.redirect("/users");
}
