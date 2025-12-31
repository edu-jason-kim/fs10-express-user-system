import express from "express";

import reviewService from "../services/reviewService.js";
import auth from "../middlewares/auth.js";
import passport from "../config/passport.js";

const reviewController = express.Router();

reviewController.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;
    try {
      const createdReview = await reviewService.create({
        ...req.body,
        authorId: userId,
      });
      return res.status(201).json(createdReview);
    } catch (error) {
      return next(error);
    }
  }
);

reviewController.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await reviewService.getById(id);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

reviewController.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll();
    return res.json(reviews);
  } catch (error) {
    return next(error);
  }
});

reviewController.put("/:id", async (req, res, next) => {
  try {
    const updatedReview = await reviewService.update(req.params.id, req.body);
    return res.json(updatedReview);
  } catch (error) {
    return next(error);
  }
});

reviewController.delete(
  "/:id",
  auth.verifyAccessToken, // 인증된 사용자인지 확인 (req.user에 유저 정보 삽입)
  auth.verifyReviewAuth, // 리뷰를 삭제할 권한이 있는지 확인
  async (req, res, next) => {
    try {
      const deletedReview = await reviewService.deleteById(req.params.id);
      return res.json(deletedReview);
    } catch (error) {
      return next(error);
    }
  }
);

export default reviewController;
