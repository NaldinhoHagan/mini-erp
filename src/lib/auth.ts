import { Request, Response, NextFunction } from "express";

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).user) return next();
  return res.redirect("/login");
}

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.session && (req.session as any).user;
  if (user?.role === "ADMIN") return next();
  return res.status(403).send("Acesso negado");
}
