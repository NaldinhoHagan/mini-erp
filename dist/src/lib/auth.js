export function ensureAuth(req, res, next) {
    if (req.session && req.session.user)
        return next();
    return res.redirect("/login");
}
export function ensureAdmin(req, res, next) {
    const user = req.session && req.session.user;
    if (user?.role === "ADMIN")
        return next();
    return res.status(403).send("Acesso negado");
}
