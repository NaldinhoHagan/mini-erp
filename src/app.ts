import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import productsRoutes from "./routes/products.routes.js";
import { ensureAuth } from "./lib/auth.js";
import csrf from "csurf";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 },
  })
);
app.use(morgan("dev"));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// CSRF
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = (req as any).csrfToken();
  res.locals.user = (req.session as any).user || null;
  next();
});

app.get("/", ensureAuth, (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

app.use(authRoutes);
app.use(usersRoutes);
app.use(clientsRoutes);
app.use(productsRoutes);

// 404
app.use((req, res) => res.status(404).send("Página não encontrada"));

export default app;
