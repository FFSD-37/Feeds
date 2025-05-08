import express from 'express';
import {
    handleGetpost,
    handlePostDelete,
    handlePostupload,
    suggestedPost,
    suggestedReels
} from '../controllers/userPost.js';

const router=express.Router();

router.post('/',handlePostupload);
router.get('/:id',handleGetpost);
router.delete('/:id',handlePostDelete);
router.get('/suggestedPost/get',suggestedPost);
router.get('/suggested/reels',suggestedReels);

export default router;