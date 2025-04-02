import express from 'express';
import {
    handlePostDelete,
    handlepostupload
} from '../controllers/post.js';

const router=express.Router();

router.post('/',handlepostupload);

router.delete('/:id',handlePostDelete)

export default router;