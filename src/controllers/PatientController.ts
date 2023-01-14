import { Request, Response } from "express";
import mongoose from "mongoose";
import Patient from "../entities/Patient";
import { IPatient } from "../interfaces/patient";

export class PatientController {
  async create(req: Request, res: Response) {
    const { name = "", owner = "", email = "", symptoms = "" } = req.body;

    const nameToSave = name.toLowerCase().trim();

    if ([name, owner, email, symptoms].includes("")) {
      const e = new Error("Hay Campo vacio");
      return res.status(400).json({ msg: e.message });
    }

    const ptientExist = await Patient.findOne({ name: nameToSave })
      .where("user")
      .equals(req.user);
    if (ptientExist) {
      const e = new Error("Paciente ya existe");
      return res.status(400).json({ msg: e.message });
    }
    const newPatient = new Patient({ name: nameToSave, owner, email, symptoms });
    newPatient.user = req.user;
    try {
      await newPatient.save();
      return res.status(201).json({newPatient, msg: "Agregado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const patients = await Patient.find({
        take: Number(limit),
        skip: Number(offset),
      })
        .populate("user")
        .where("user")
        .equals(req.user);

      return res.json(patients);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let patient: null | IPatient | string;

    if (mongoose.Types.ObjectId.isValid(term)) {
      if (!mongoose.Types.ObjectId.isValid(term)) {
        const e = new Error("paciente no valida");
        return res.status(400).json({ msg: e.message });
      }

      patient = await Patient.findById({ _id: term })
        .where("user")
        .equals(req.user);
    } else {
      patient = await Patient.findOne({ name: term.toLowerCase() })
        .where("user")
        .equals(req.user);
    }

    if (!patient) {
      const e = new Error("Paciente no existe");
      return res.status(400).json({ msg: e.message });
    }

    // if (patient.user!._id !== req.user!._id){
    //   const e = new Error("acceso no permitido");
    //   return res.status(400).json({ msg: e.message });
    // }

    if (!patient.isActive){
      const e = new Error("Paciente no activo");
      return res.status(400).json({ msg: e.message });
    }

    return res.json({patient});
  }

  //********************************************************************** */

  async update(req: Request, res: Response) {
    const { name, owner, email, symptoms, isActive } = req.body;
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(_id)){
    //   const e = new Error("paciente no valida");
    //   return res.status(400).json({ msg: e.message });
    // }

    const patient = await Patient.findById(id).where("user").equals(req.user);
    if (!patient) {
      const e = new Error("paciente no Existe");
      return res.status(400).json({ msg: e.message });
    }


    if (!patient.isActive){
      const e = new Error("Paciente no activo");
      return res.status(400).json({ msg: e.message });
    }

    // if (patient.user!._id !== req.user!._id){
    //   const e = new Error("acceso no permitido");
    //   return res.status(400).json({ msg: e.message });
    // }

    patient.name = name || patient.name;
    patient.owner = owner || patient.owner;
    patient.email = email || patient.email;
    patient.symptoms = symptoms || patient.symptoms;
    patient.isActive = isActive;

    try {
      const patientUpdate =  await patient.save();
      return res.json({ patientUpdate, msg: "Editado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("paciente no valida");
      return res.status(400).json({ msg: e.message });
    }

    const patient = await Patient.findById( id ).where("user").equals(req.user);

    if (!patient) {
      const e = new Error("paciente no existe");
      return res.status(400).json({ msg: e.message });
    }

    // if (patient.user!._id !== req.user!._id) {
    //   const e = new Error("acceso no permitido");
    //   return res.status(400).json({ msg: e.message });
    // }

    if (!patient.isActive){
      const e = new Error("Paciente no activo");
      return res.status(400).json({ msg: e.message });
    }

    try {
      await patient.deleteOne();
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }
}
