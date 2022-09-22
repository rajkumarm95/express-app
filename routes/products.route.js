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
 * multer upload
 */
var upload = multer({ storage: Storage });

/**
 * @route get all products
 * @route find all products by name
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
                        res.json({mes:'something went wrong'})

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
                            description: req.body.desc,
                            published: req.body.published,
                            image: base64Img,
                        });
                        await product.save();
                        res.json(product);
                        fs.unlinkSync(req.file.path)
                    } catch (error) {
                        console.log(error);
                        res.json({mes:'something went wrong'})
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
                            res.json({ mes: "no records to delete" });
                          }
                    } catch (error) {
                          console.log(error);
                          res.json({ mes: "something went wrong" });
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
                        res.json({ mes: "something went wrong" });
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
                      res.json({ mes: "something went wrong" });
                }
            })
            .put((req,res)=>{
                const id = req.params.id;
                res.json({mes: 'edit a product', id})
            })
            .delete(async (req,res)=> {
                 try {
                    const id = req.params.id;
                    const product = await Product.deleteOne({_id: id});
                    if (product.deletedCount > 0) {
                        res.json({
                            mes: ` products with id : ${id} has been deleted`,
                        });
                    } else {
                        res.json({
                            mes: `cannot find the product with id :${id}`
                        });
                    }
                } catch (error) {
                    console.log(error);
                    res.json({ mes: "something went wrong" });
                }
            })

module.exports = productRoute