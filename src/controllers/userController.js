import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userController = express.Router();

// 회원가입
userController.post("/users", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// 로그인
userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.login(email, password);

    // Session 기반 인증
    // req.session.userId = user.id;
    // return res.json(user);

    // Token 기반 인증
    const accessToken = userService.createToken(user, "access"); // 1h
    const refreshToken = userService.createToken(user, "refresh"); // 2w
    await userService.updateUser(user.id, { refreshToken });

    // 방법1. Cookie를 통해 토큰 전달 (추후 브라우저로부터 Cookie를 통해 토큰 전달 받음)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // 방법2. 응답을 통해 토큰 전달 (추후 브라우저로부터 Authorization 헤더를 통해 토큰 전달 받음)
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req, res) => {
    try {
      const userId = req.auth.userId;
      const refreshToken = req.cookies.refreshToken;
      const accessToken = await userService.refreshToken(userId, refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
