import express from 'express';
import { addEmploye, deleteEmploye, employes, login, updateEmploye } from '../Controller/employe.controller.js';
const router = express.Router();


router.post('/login', login);
// router.post('/signup', signup);
router.get('/employes', employes);
router.put('/employe/:id', updateEmploye);
router.delete('/employe/:id', deleteEmploye);
router.post('/addEmploye', addEmploye);

export default router;