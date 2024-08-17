import foodModel from "../models/foodModel.js";
import fs from 'fs';


//add food item


export const addFood = async (req,res) => {
    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
    })
    try{
        await food.save();
        res.json({
            success:true,
            message:"food saved successfully"
        })
    }catch(error){
        console.log(error.stack);
        res.json({
            success:false,
            message:"error"
        })
    }
        
}

//all food list

export const listFood = async (req, res) => {

    try{
        const foods = await foodModel.find({});
        res.json({
            success:true,
            foods
        })
    }catch(error){
        console.log(error.stack);
        res.json({
            success:false,
            message:"error"
        })
    }

}

//delete food item

export const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findByIdAndDelete(req.body.id);
        if(!food){
            return res.status(404).json({
                success:false,
                message:"food not found"
            })
        }
        fs.unlink(`uploads/${food.image}`, (err) => {
            if(err) throw err;
            console.log('File deleted!');
        });
        res.json({
            success:true,
            message:"food deleted successfully"
        })
    }catch(error){
        console.log(error.stack);
        res.json({
            success:false,
            message:"Error"
        })
    }
}











