const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

let products = [
  { id: 1, name: "iPhone 12 Pro", price: 1099.99 , img: 'apple-iphone-12-pro-max-512-gb-or.jpeg' },
  { id: 2, name: "Samsung Galaxy S21", price: 999.99, img: 's21.jpeg' },
  { id: 3, name: "Sony PlayStation 5", price: 499.99, img: 'PLAYSTATION-5-DIGITAL.jpeg' },
  { id: 4, name: "MacBook Pro 16", price: 2399.99, img: 'mackbook 16 pro.jpeg' },
  { id: 5, name: "Ipad Pro", price: 799.99, img: 'ipad pro.jpeg' },
];

const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(loggerMiddleware);

app.get("/products", (req, res) => {
  res.render('home', {
    products
  });
  // req.send(products);
});

app.get("/products/:id", (req, res, next) => {
  const findPrd = products.find((prd) => prd.id == req.params.id);
  if (!findPrd) {
    const error = new Error("User not found ");
    error.statusCode = 404;
    next(error);
  } else {
    res.status(201).render('productDetails', {
      product: findPrd
    });
  }
});

app.get("/products/search", (req, res) => {
  const searchQuery = req.query.q;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  if (req.query.q) {
    const filterProductsByName = products.filter((prd) => {
      return prd.name.toLowerCase().includes(req.query.q.toLowerCase());
    });
    if (filterProductsByName.length == 0) {
      res.status(404).send({ message: "No such product with that name" });
      return;
    }
    res.status(200).send(filterProductsByName);
  }
});

app.post("/products", (req, res) => {
  products.push({ id: products.length + 1, ...req.body });
  res.status(200).send(products);
});

app.put("/products/:id", (req, res) => {
  const findPrd = products.find((prd) => prd.id == req.params.id);
  if (!findPrd) {
    res.status(404).send({ message: "product not found " });
  }
  // map
});

app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "product not found " });
  }
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
