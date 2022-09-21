const express = require('express')
const mongoose = require('mongoose')
const productRoute = require('./routes/products.route')
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const port = process.env.PORT;
const mondoDbURL = process.env.MONGO_URL;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

/**
 * @desc using mongoose to connect to mongoDB database
 */
mongoose.connect(
  mondoDbURL,
  () => console.log("database connected"),
  (e) => console.log("failed to connect database", e)
);

/**
 * @route health check route
 */
app.get('/health', (req,res)=>{
    res.status(200)
    res.send('healthy')
})


app.use("/api/products", productRoute);

app.listen(port, ()=> console.log(`server started on port : ${port}`))