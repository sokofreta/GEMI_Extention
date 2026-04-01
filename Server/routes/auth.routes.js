import { Router } from "express";


const router=Router();

router.post('/login', async (req, res, next) => {
    try {
    //   const ip = getClientIp(req);
    //   const uname = req.body.username;
    //   const pwd = req.body.password;
    //   const service = new AuthService();
    //   const user = await service.login({ pwd, uname, ip });
  
    //   res.json(user);
    } catch (error) {
      next(error);
    }
  });

export const authRoutes = router;