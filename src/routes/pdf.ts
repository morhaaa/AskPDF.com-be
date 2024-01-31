import { Router } from "express";
import PdfController from "../controllers/pdf";

const router = Router();
const controller = new PdfController()

//Get all pdf
router.get('/all', (req, res) => controller.getAllFiles(req, res))

//Get single pdf
router.get('/:pdf_id',(req, res) => controller.getFile(req, res))

//Post pdf to db
router.post('/', (req, res) => controller.createFile(req, res))

//Remove pdf from db
router.delete('/:pdf_id',(req, res) => controller.deleteFile(req, res))

export default router