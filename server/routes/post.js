import express from 'express';
import {
    handlepostupload
} from '../controllers/post.js';

const router=express.Router();

router.post('/',handlepostupload);

router.delete('/:id')

export default router;