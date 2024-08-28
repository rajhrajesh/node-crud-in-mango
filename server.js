const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Product Name"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(500)
        .json({ message: `Cannot find any product with Id ${id}` });
    }
    const updateProduct = await Product.findById(id);
    res.status(200).json(updateProduct);

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.delete('/product/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `Cannot find a product ${id}`})
        }
        res.status(200).json({message: `you have suucessfully delete this ${id}`})
    }
    catch(e){
        res.status(500).json({message: e.message})
    }
})


app.post("/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://penurajeshitsd:VApdKDQwcGv7RQ9c@penurajeshitsd.tslam.mongodb.net/Node-JS?retryWrites=true&w=majority&appName=penurajeshitsd"
  )
  .then(() => {
    app.listen(4000, () => {
      console.log(`Server Connected "4000"`);
    });

    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });
