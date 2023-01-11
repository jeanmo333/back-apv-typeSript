import { NextFunction, Request, Response } from "express";




export const isAdmin = async ( 
    req: Request,
    res: Response,
    next: NextFunction ) => {

    if ( !req.user ) {
        const e = new Error("No autorizado");
        return res.status(400).json({ msg: e.message });
    }

    const { roles} = req.user;
    
    if ( !roles?.includes("admin")) {
        const e = new Error("Solo administrador puede Hacer eso");
        return res.status(400).json({ msg: e.message });
    }

    next();
}

