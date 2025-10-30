import { prisma } from "../lib/prisma.js";
export async function listProducts(req, res) {
    const q = req.query.q || "";
    const products = await prisma.product.findMany({
        where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
        orderBy: { id: "desc" },
    });
    res.render("products/index", { title: "Produtos", products, q });
}
export async function getNewProduct(req, res) {
    res.render("products/new", { title: "Novo Produto" });
}
export async function postNewProduct(req, res) {
    const { name, price, stock } = req.body;
    await prisma.product.create({ data: { name, price: Number(price), stock: Number(stock) || 0 } });
    res.redirect("/products");
}
export async function getEditProduct(req, res) {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
        return res.status(404).send("Produto não encontrado");
    res.render("products/edit", { title: "Editar Produto", product });
}
export async function postEditProduct(req, res) {
    const id = Number(req.params.id);
    const { name, price, stock } = req.body;
    await prisma.product.update({ where: { id }, data: { name, price: Number(price), stock: Number(stock) } });
    res.redirect("/products");
}
export async function postDeleteProduct(req, res) {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.redirect("/products");
}
