import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";

export async function listProducts(req: Request, res: Response) {
  const q = (req.query.q as string) || "";
  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { id: "desc" },
  });
  res.render("products/index", { title: "Produtos", products, q });
}

export async function getNewProduct(req: Request, res: Response) {
  res.render("products/new", { title: "Novo Produto" });
}

export async function postNewProduct(req: Request, res: Response) {
  const { name, price, stock } = req.body;
  await prisma.product.create({ data: { name, price: Number(price), stock: Number(stock) || 0 } });
  res.redirect("/products");
}

export async function getEditProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).send("Produto não encontrado");
  res.render("products/edit", { title: "Editar Produto", product });
}

export async function postEditProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, price, stock } = req.body;
  await prisma.product.update({ where: { id }, data: { name, price: Number(price), stock: Number(stock) } });
  res.redirect("/products");
}

export async function postDeleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.redirect("/products");
}
