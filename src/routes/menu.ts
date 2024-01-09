import express from "express";
import { MenuItem } from "../models/menuItem";

const router = express.Router();
router.get('/menu-items',async (req,res)=>{
    console.log('获取侧边栏')
    try {
        const items = await MenuItem.find();
        res.json({successed:true,items:items,status:200})
    } catch (error) {
        res.status(500).json({successed:false,message:error.message,status:500})
    }
})
export default router