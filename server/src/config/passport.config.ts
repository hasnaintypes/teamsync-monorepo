import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/app-error";
import { logger } from "../utils/logger";
import { ProviderEnum } from "../enums/auth-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";

/**
 * Configures Passport.js authentication strategies for the application.
 *
 * NOTE: The Google OAuth strategy uses the profile returned by Google to either log in or create a user account.
 * The Local strategy verifies user credentials using the application's own user service.
 * Passport's session management is used for serialization and deserialization of user objects.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }
        if (!email) {
          throw new NotFoundException(
            "Email is required for authentication"
          );
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        done(null, user as Express.User);
      } catch (error) {
        logger.error(
          "[Passport][GoogleStrategy] Error during authentication:",
          error
        );
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user as Express.User);
      } catch (error) {
        logger.error(
          "[Passport][LocalStrategy] Error during authentication:",
          error
        );
        return done(error, false, {
          message: error instanceof Error ? error.message : "Authentication failed",
        });
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));
