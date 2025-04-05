import express from 'express';
import {
    handleGetpost,
    handlePostDelete,
    handlePostupload
} from '../controllers/post.js';

const router=express.Router();

router.post('/',handlePostupload);
router.get('/:id',handleGetpost);
router.delete('/:id',handlePostDelete);

export default router;