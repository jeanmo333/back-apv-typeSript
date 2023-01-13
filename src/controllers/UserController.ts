import { Request, Response } from "express";
import bcrypt, { hash} from "bcrypt";
import jwt from "jsonwebtoken";
import emailForgetPassword from "../helpers/emailForgetPassword";
import emailRegister from "../helpers/emailRegister";
import { IUser } from "../interfaces/user";
import User from "../entities/User";
import genarateId from "../helpers/genarateId";


export class UserController {
  async create(req: Request, res: Response) {
    const {
      name = "",
      email = "",
      password = "",
      phone = "",
      address = "",
      web = "",
      roles="client"
    } = req.body;

    if ([name, email, password].includes("")) {
      const e = new Error("Hay Campo vacio");
      return res.status(400).json({ msg: e.message });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      const e = new Error("Usuario ya existe");
      return res.status(400).json({ msg: e.message });
    }

    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        phone,
        address,
        web,
        roles
      });
      await newUser.save();

     // send email
        emailRegister({
          email,
          name,
          token: newUser.token,
        });

    
      return res.status(200).json({ msg: "Reviasa tu email para comfirmar tu cuenta" });
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  // async createByAdmin(req: Request, res: Response) {
  //   const {
  //     name = "",
  //     email = "",
  //     password = "",
  //     phone = "",
  //     address = "",
  //     web = "",
  //     roles = "",
  //   } = req.body;

  //   if ([name, email, password, roles].includes("")) {
  //     throw new BadRequestError("Hay Campo vacio");
  //   }

  //   const userExists = await userRepository.findOneBy({ email });

  //   if (userExists) {
  //     throw new BadRequestError("Usuario ya existe");
  //   }

  //   const hashPassword = await bcrypt.hash(password, 10);

  //   const newUser = userRepository.create({
  //     name,
  //     email,
  //     password: hashPassword,
  //     phone,
  //     address,
  //     web,
  //     roles,
  //   });

  //   try {
  //     await userRepository.save(newUser);

  //     // send email
  //     //   emailRegister({
  //     //     email,
  //     //     name,
  //     //     token: newUser.token,
  //     //   });

  //     const { password: _, ...user } = newUser;

  //     return res.status(201).json(user);
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestError("revisar log servidor");
  //   }
  // }

  /*********************************************************************/

  // async getAllUsersByAdmin(req: Request, res: Response) {
  //   const { limit = 10, offset = 0 } = req.query;
  //   try {
  //     const users = await userRepository.find({
  //       where: {
  //         isActive: true,
  //       },
  //       take: Number(limit),
  //       skip: Number(offset),
  //     });

  //     return res.json(users);
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestError("revisar log servidor");
  //   }
  // }
  /***************************************************************************** */
  // async updateUserByAdmin(req: Request, res: Response) {
  // const { id } = req.params;
  //   const { email } = req.body;

  //   const user = await userRepository.findOneBy({ id });
  //   if (!user) {
  //     throw new BadRequestError("usuario no existe");
  //   }

  //   if (user.email !== req.body.email) {
  //     const existEmail = await userRepository.findOneBy({ email });

  //     if (existEmail) {
  //       throw new BadRequestError("Ese email ya esta en uso");
  //     }
  //   }

  //   try {
  //     const userUpdate = await userRepository.update(id!, req.body);
  //     res.json(userUpdate);
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestError("revisar log servidor");
  //   }
  // }

  /*********************************************************************/

  async login(req: Request, res: Response) {
    const { email = "", password = "" } = req.body;

    if ([email, password].includes("")) {
      const e = new Error("Hay Campo vacio");
      return res.status(400).json({ msg: e.message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      const e = new Error("Email o password no valido");
      return res.status(400).json({ msg: e.message });
    }

    const verifyPass = await bcrypt.compare(password, user.password!);

    if (!verifyPass) {
      const e = new Error("Email o password no valido");
      return res.status(400).json({ msg: e.message });
    }

    if (!user.isActive) {
      const e = new Error("Tu cuenta no ha sido confirmado");
      return res.status(400).json({ msg: e.message });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS!, {
      expiresIn: "8h",
    });

    // const { password: _, ...userLogin } = user;

    return res.json({
      user,
      token: token,
    });
  }

  /*********************************************************************/

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  /*********************************************************************/

  async confirmAccount(req: Request, res: Response) {
    const { token } = req.params;
    const userConfirm = await User.findOne({ token });

    if (!userConfirm) {
      const e = new Error("Token no válido");
      return res.status(400).json({ msg: e.message });
    }

    try {
      userConfirm.token = "";
      userConfirm.isActive = true;
      await userConfirm.save();

    return  res.json({ msg: "Cuenta Confirmado Con Exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      const e = new Error("El Usuario no existe");
      return res.status(400).json({ msg: e.message });
    }

    try {
      userExist.token = genarateId();
      await userExist.save();

      // Enviar Email con instrucciones
        emailForgetPassword({
      	email,
      	name: userExist.name,
      	token: userExist.token,
        });

      res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  async verifyToken(req: Request, res: Response) {
    const { token } = req.params;

    const ValidToken = await User.findOne({ token });

    if (ValidToken) {
      // El TOken es válido el usuario existe
      res.json({ message: "Token válido y el usuario existe" });
    } else {
      const e = new Error("Token no válido");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  async newPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      const e = new Error("Hubo un error");
      return res.status(400).json({ msg: e.message });
    }

    try {
      user.token = "";
      user.password = await hash(password, 10);
      await user.save();
      res.json({ msg: "Password modificado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  async updateProfile(req: Request, res: Response) {
    const { _id } = req.user as IUser;
    const { email, name, phone, address, web } = req.body;

    const user = await User.findOne({ _id });
    if (!user) {
      const e = new Error("usuario no existe");
      return res.status(400).json({ msg: e.message });
    }

    if (user.email !== req.body.email) {
      const existEmail = await User.findOne({ email });

      if (existEmail) {
        const e = new Error("Ese email ya existe");
        return res.status(400).json({ msg: e.message });
      }
    }

    try {
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.address = address;
      user.web = web;

      const userUpdate = await user.save();
      res.json(userUpdate);

      // const userUpdate = await user.update(_id, {
      //   email,
      //   name,
      //   phone,
      //   address,
      //   web,
      // });
      // res.json(userUpdate);
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }

  /*********************************************************************/

  async updatePassword(req: Request, res: Response) {
    // Leer los datos
    const { _id } = req.user as IUser;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Comprobar que el veterinario existe
    const user = await User.findOne({ _id });
    if (!user) {
      const e = new Error("Ese email ya existe");
      return res.status(400).json({ msg: e.message });
    }

    const verifyPass = await bcrypt.compare(pwd_actual, user.password!);

    if (!verifyPass) {
      const e = new Error("password actual no valido");
      return res.status(400).json({ msg: e.message });
    }

    try {
      user.password = pwd_nuevo;
      await user.save();
      res.json({ msg: "Password Almacenado Con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("hubo un error");
      return res.status(400).json({ msg: e.message });
    }
  }
}
