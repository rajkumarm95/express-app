const express = require('express')
const  multer = require("multer");
const fs = require('fs')
const Product = require('./../schema/products.schema')

const productRoute = express.Router();


/**
 * @desc Multer storage
 */
var Storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        },
});

/**
 * @desc multer upload
 */
var upload = multer({ storage: Storage });

/**
 * @route get all products
 * @route find products by name
 */
productRoute.get('/',async (req,res)=>{
                    try {
                        const name = req.query.name;
                        let product;
                        if (name) {
                            product = await Product.find({ name });
                        } else {
                            product = await Product.find();
                        }
                        res.json(product);
                    } catch (error) {
                        console.log(error);
                        res.json({mes:'Something went wrong'})

                    }

                })

/**
 * @route add new product
 */
productRoute.post("/", upload.single("image"), async (req, res) => {
                    try {
                        const img = fs.readFileSync(req.file.path);
                        const base64Img = img.toString("base64");
                        const product = await Product.create({
                          name: req.body.name,
                          description: req.body.description,
                          published: req.body.published,
                          image: base64Img,
                        });
                        await product.save();
                        fs.unlinkSync(req.file.path)
                        res.json(product);
                    } catch (error) {
                        console.log(error);
                        res.json({mes:'Something went wrong'})
                    }

                });

/**
 * @route delete all data
 */
productRoute.delete("/", async (req, res) => {
                    try {
                          const product = await Product.deleteMany();
                          if (product.deletedCount > 0) {
                            res.json({
                              mes: `${product.deletedCount} products has been deleted`,
                            });
                          } else {
                            res.json({ mes: "No records to delete" });
                          }
                    } catch (error) {
                          console.log(error);
                          res.json({ mes: "Something went wrong" });
                    }
                });

/**
 * @route display all published products
 */
productRoute.get("/published", async (req, res) => {
                    try {
                        const product = await Product.find({ published: true });
                        res.json(product);
                    } catch (error) {
                        console.log(error);
                        res.json({ mes: "Something went wrong" });
                    }
                });

/**
 * @route display a product
 * @route edit a product
 * @route delete a product
 */
productRoute.route('/:id')
            .get(async (req,res)=>{
                try {
                    const id = req.params.id;
                    const product = await Product.findById(id);
                    res.json(product);
                } catch (error) {
                      console.log(error);
                      res.json({ mes: "Something went wrong" });
                }
            })
            .put(upload.single("image"),async (req,res)=>{
                try {
                    const _id = req.params.id;
                    const data = req.body
                    data.updatedAt = Date.now()
                    if(req.file){
                        const img = fs.readFileSync(req.file.path);
                        const image = img.toString("base64");
                        data.image = image;
                        fs.unlinkSync(req.file.path);
                    }
                    const product = await Product.updateOne({_id},{...data})

                    if(product.modifiedCount){
                        res.json({mes: 'Product updated successfully'})
                    }else{
                       res.json({ mes: "Product already up to date" });
                    }
                } catch (error) {
                    console.log(error);
                    res.json({ mes: "Something went wrong" });
                }
            })
            .delete(async (req,res)=> {
                try {
                    const id = req.params.id;
                    const product = await Product.findByIdAndDelete(id);
                    if (product) {
                        res.json({
                            mes: ` Products with id : ${id} has been deleted`,
                        });
                    } else {
                        res.json({
                            mes: `Cannot find the product with id :${id}`
                        });
                    }
                } catch (error) {
                    console.log(error);
                    res.json({ mes: "Something went wrong" });
                }
            })

module.exports = productRoute