import express from "express";
import { PatientController } from "../controllers/PatientController";
const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddleware'



//protected routes
router.use(authMiddleware)
router.post('/', new PatientController().create)
router.get('/', new PatientController().findAll)
router.get('/:term', new PatientController().findOne)
router.put('/:id', new PatientController().update)
router.delete('/:id', new PatientController().remove)


export default router;