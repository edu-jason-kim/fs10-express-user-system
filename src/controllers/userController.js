import express from "express";
import userService from "../services/userService.js";

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
    const accessToken = userService.createToken(user);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

export default userController;
