import { expressjwt } from "express-jwt";
import reviewService from "../services/reviewService.js";

function verifySession(req, res, next) {
  if (!req.session.userId) {
    const error = new Error("Unauthorized");
    error.code = 401;
    return next(error);
  }

  // 사용자 정보가 있으면 다음 미들웨어로
  return next();
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  // request의 어떤 속성에 payload정보를 담을건지: req.user
  requestProperty: "user", // req.user
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  // 토큰이 Authorization 헤더가 아닌 쿠키에 있으므로,
  // 별도로 토큰을 가져올 수 있도록 설정을 해줘야 함
  getToken: (req) => req.cookies.refreshToken,
  requestProperty: "auth", // req.auth
});

async function verifyReviewAuth(req, res, next) {
  const reviewId = req.params.id;
  try {
    const review = await reviewService.getById(reviewId);

    if (!review) {
      const error = new Error("Review not found");
      error.code = 404;
      next(error);
    }

    if (review.authorId !== req.user.userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default {
  verifySession,
  verifyReviewAuth,
  verifyAccessToken,
  verifyRefreshToken,
};
