// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../entities/User";
// import { IUser } from "../interfaces/user";

// type JwtPayload = {
//   id: string;
// };

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { authorization } = req.headers;
//   if (!authorization) {
//     const error = new Error("No Hay token en la peticion");
//     res.status(403).json({ msg: error.message });
//   }

//   try {
//   const tokenJwt = authorization!.split(" ")[1];
//   const { id } = jwt.verify(tokenJwt, process.env.JWT_PASS ?? "") as JwtPayload;
//   const user = await User.findById( id );

//   if (!user) {
//     const error = new Error("No autorizado");
//     res.status(403).json({ msg: error.message });
//   }

//   if (!user!.isActive) {
//     const error = new Error("Usuario no esta activo");
//     res.status(403).json({ msg: error.message });
//   }


//   const { password: _,token, ...loggedUser } = user as IUser;
//   req.user = loggedUser;
//   next();
// } catch (error) { 
//   console.log(error)
//  const e = new Error("Token no Válido");
//  res.status(403).json({ msg: e.message });
// }
// };







import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

type JwtPayload = {
  id: string;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_PASS!) as JwtPayload;

    if (!token) {
      const error = new Error("Token no Válido o inexistente");
      res.status(403).json({ msg: error.message });
    }

    try {
      req.user = await User.findById(decoded.id).select(
        "-password -token -confirmado"
      );
      return next();
    } catch (error) {
      const e = new Error("Token no Válido");
      return res.status(403).json({ msg: e.message });
    }
  }

  if (!token) {
    const error = new Error("Token no Válido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

