import Router from "express"
import { asyncHandler, authenticate, validateBody } from "@trustops/shared"
import { addEmailSchema, forgotPasswordSchema, loginSchema, registerSchema, resendVerificationSchema, resetPasswordSchema, walletLoginSchema, walletNonceSchema } from "../schemas/auth.schema"
import * as authController from "../controllers/auth.controller"

export const authRouter = Router()

authRouter.post("/register", validateBody(registerSchema), asyncHandler(authController.registerController))
authRouter.get("/verify-email", asyncHandler(authController.verfiyEmailController))
authRouter.post("/resend-verification", validateBody(resendVerificationSchema), asyncHandler(authController.resendVerificationController))

authRouter.post("/login", validateBody(loginSchema), authController.loginController)
authRouter.post("/logout", asyncHandler(authenticate) ,asyncHandler(authController.logoutController))

authRouter.post("/refresh", asyncHandler(authController.refreshController))

authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), asyncHandler(authController.forgotPasswordController))
authRouter.post("/reset-password", validateBody(resetPasswordSchema) ,asyncHandler(authController.resetPasswordController))

authRouter.get("/google", asyncHandler(authController.googleRedirectController))
authRouter.get("/google/callback", asyncHandler(authController.googleAuthCallbackController))

// authRouter.get("/2fa/setup", asyncHandler(authenticate), asyncHandler(authController.twoFASetupController))
// authRouter.post("/2fa/verify", asyncHandler(authenticate), asyncHandler(authController.twoFAVerifyController))

authRouter.post("/wallet/nonce", validateBody(walletNonceSchema), asyncHandler(authController.walletNonceController))
authRouter.post("/wallet/login", validateBody(walletLoginSchema), asyncHandler(authController.walletLoginController))
authRouter.post("/add-email", asyncHandler(authenticate), validateBody(addEmailSchema), asyncHandler(authController.addEmailController))