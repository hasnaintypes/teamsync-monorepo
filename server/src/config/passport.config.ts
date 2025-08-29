import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/app-error";
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
        console.log("[Passport][GoogleStrategy] Received profile:", profile);
        console.log("[Passport][GoogleStrategy] Google ID:", googleId);
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        done(null, user);
      } catch (error) {
        console.error(
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
        return done(null, user);
      } catch (error: any) {
        console.error(
          "[Passport][LocalStrategy] Error during authentication:",
          error
        );
        return done(error, false, { message: error?.message });
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
