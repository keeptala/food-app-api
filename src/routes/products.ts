import * as multer from "multer";
import { Router } from 'express';
import ProductsRepository from '../repository/products.repository';

const productsRoutes = Router();
const repo = new ProductsRepository();


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
productsRoutes.get('/',async (_,res)=>{
    const result = await repo.fetchProducts();

    res.json({
        message:"available products",
        products:result
    })
})

productsRoutes.get('/:id',async (req,res)=>{
    const result = await repo.fetchProduct(parseInt(req.params.id));
    res.json({
        message:"available product",
        product:result
    })
})

productsRoutes.post('/',upload.single("image"),async (req,res)=>{
    const result = await repo.createProduct({...req.body,imageUrl:req.file.path});
    res.json({
        message:"new product",
        product:result
    })
})

productsRoutes.put('/',async (req,res)=>{
    console.log(req.body)
    const result = await repo.updateProduct(req.body);
    res.json({
        message:"update successfull",
        product:result
    })
})

productsRoutes.delete('/:id',async (req,res)=>{
    const result = await repo.deleteProduct(req.params.id);
    res.json({
        message:"delete product",
        product:result
    })
})


export default productsRoutes;