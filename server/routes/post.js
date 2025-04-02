import express from 'express';
import {
    handlepostupload
} from '../controllers/post.js';

const router=express.Router();

router.post('/',handlepostupload);

export default router;