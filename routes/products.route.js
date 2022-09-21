const express = require('express')
const Product = require('./../schema/products.schema')

const productRoute = express.Router()
/**
 * @route get all products
 * @route find all products by name
 */
productRoute.get('/',async (req,res)=>{
                    const name = req.query.name;
                    let product
                    if(name){
                         product = await Product.find({name})
                    }
                    else{
                         product = await Product.find();
                    }
                    res.json(product)
                })

/**
 * @route add new product
 */
productRoute.post("/",async (req, res) => {
                    const product = await Product.create({
                        name: req.body.name,
                        description: req.body.desc,
                        published: req.body.published,
                    });
                    product.save();
                    res.json(product);
});

/**
 * @route delete all data
 */
productRoute.delete("/", async (req, res) => {
                    const product = await Product.deleteMany()
                    if(product.deletedCount > 0){
                        res.json({mes: `${product.deletedCount} products has been deleted`});
                    }
                    else{
                        res.json({mes: 'no records to delete'})
                    }
                });

/**
 * @route display all published products
 */
productRoute.get("/published", async (req, res) => {
                    const product = await Product.find({published: true})
                    res.json(product);
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
                    res.json({err : error.message})
                }
            })
            .put((req,res)=>{
                const id = req.params.id;
                res.json({mes: 'edit a product', id})
            })
            .delete(async (req,res)=> {
                const id = req.params.id;
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
                    res.json({err : error.message})
                }
            })

module.exports = productRoute