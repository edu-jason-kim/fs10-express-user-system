import { expressjwt } from "express-jwt";

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
  requestProperty: "user",
});

export default {
  verifySession,
  verifyAccessToken,
};
