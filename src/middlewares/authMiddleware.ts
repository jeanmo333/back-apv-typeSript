import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";
import { IUser } from "../interfaces/user";

type JwtPayload = {
  id: string;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    const error = new Error("No Hay token en la peticion");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const tokenJwt = authorization!.split(" ")[1];
    const payload = jwt.verify(tokenJwt, process.env.JWT_PASS!) as JwtPayload;

    // if (!payload) {
    //   const error = new Error("Token no valido");
    // return  res.status(403).json({ msg: error.message });
    // }

    const user = await User.findById(payload.id).select("-password -token");

    if (!user) {
      const error = new Error("No autorizado");
      return res.status(403).json({ msg: error.message });
    }

    if (!user?.isActive) {
      const error = new Error("Usuario no esta activo");
      return res.status(403).json({ msg: error.message });
    }

    // const { password,token, ...loggedUser } = user as IUser;
    req.user = user;
    return next();
  } catch (error) {
   // console.log(error);
    const e = new Error("Token no Válido");
    return res.status(400).json({ msg: e.message });
  }
};

// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../entities/User";

// type JwtPayload = {
//   id: string;
// };

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];

//     if (!token) {
//       const error = new Error("No hay token en la peticion");
//       res.status(403).json({ msg: error.message });
//     }

//     try {
//       const { id } = jwt.verify(token, process.env.JWT_PASS!) as JwtPayload;
//       const user = await User.findById(id).select(
//         "-password -token -confirmado"
//       );

//       if (!user) {
//         const error = new Error("No autorizado");
//         res.status(403).json({ msg: error.message });
//       }

//       if (!user!.isActive) {
//         const error = new Error("Usuario no esta activo");
//         res.status(403).json({ msg: error.message });
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       const e = new Error("Token no Válido");
//       return res.status(403).json({ msg: e.message });
//     }
//   } else {
//     const error = new Error("Token no Válido");
//     res.status(403).json({ msg: error.message });
//   }

//   next();
// };
