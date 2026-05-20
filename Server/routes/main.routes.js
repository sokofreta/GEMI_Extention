import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { scrapRoutes } from "./scrap.routes.js";
import { businessPortalRoutes } from "./businessportal.routes.js";
import { UsersRoutes } from "./User.routes.js";

const router = Router();
//auth for posting data securely to an external server
router.use("/auth", authRoutes);

// scraping ordino data
router.use("/ordino", scrapRoutes);

//scraping business portal data
router.use("/businessportal", businessPortalRoutes);

//User Info
router.use("/Users" , UsersRoutes)

export const mainRoutes = router;
