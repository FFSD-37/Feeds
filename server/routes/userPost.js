import express from 'express';
import {
    handleGetpost,
    handlePostDelete,
    handlePostupload,
    suggestedPost
} from '../controllers/userPost.js';

const router=express.Router();

router.post('/',handlePostupload);
router.get('/:id',handleGetpost);
router.delete('/:id',handlePostDelete);
router.get('/suggestedPost/get',suggestedPost);

export default router;