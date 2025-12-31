import express from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";

const productController = express.Router();

// 세션 기반 인증
// productController.post("/", auth.verifySession, async (req, res, next) => {
//   const createdProduct = await productService.create(req.body);
//   return res.json(createdProduct);
// });

// 토큰 기반 인증
productController.post("/", auth.verifyAccessToken, async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productController;
