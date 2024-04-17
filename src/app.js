import express from "express";
import ProductManager from "./js_desafio_2.js";

const app = express();
const PORT = 8080;
const manager = new ProductManager("./src/products.json");

app.get(`/products`, async (req, res) => {
  const limit = +req.query.limit || 0; // Le paso a limit el limite recibido
  // en /products del localhost8080 y lo convierto en entero
  const products = await manager.getProducts(limit); // Me va a mostrar el limite recibido
  res.send({ status: 1, payload: products });
});

app.get(`/products/:uid`, async (req, res) => {
 const product = await manager.getProductById(+req.params.uid);
 res.send({ status: 1, payload: product });
});
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
