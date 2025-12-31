function verifySession(req, res, next) {
  if (!req.session.userId) {
    const error = new Error("Unauthorized");
    error.code = 401;
    return next(error);
  }

  // 사용자 정보가 있으면 다음 미들웨어로
  return next();
}

export default {
  verifySession,
};
