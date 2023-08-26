import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const userInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const userRouter = createTRPCRouter({
  signUp: publicProcedure.input(userInput).mutation(async (opts) => {
    const {
      input,
      ctx: { auth },
    } = opts;

    const newUser = await auth?.signUp({
      email: input.email,
      password: input.password,
    });

    if (newUser?.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: newUser.error.message,
        cause: newUser.error.cause,
      });
    }

    if (!newUser?.data.user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account creation failed",
      });
    }

    /** Logic to save the new user data to DB */

    /*     const newUserId = newUser.data.user.id; */

    /*     const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, newUserId))
      .catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      });

    if (existingUser.length > 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account is already registered",
      });
    }

    const newUserData = await drizzle
      .insert(users)
      .values({
        id: newUserId,
        email: input.email,
      })
      .catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }); 
      
    return newUserData  */

    return newUser;
  }),

  signIn: publicProcedure
    .input(userInput.pick({ email: true, password: true }))
    .mutation(async (opts) => {
      const {
        input: { email, password },
        ctx: { auth },
      } = opts;

      const user = await auth?.signInWithPassword({
        email,
        password,
      });

      if (user?.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: user.error.message,
          cause: user.error.cause,
        });
      }

      if (!user?.data.user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      }

      /** Logic to get the user data from DB */

      /*       const userData: User[] = await db.execute(
        sql`SELECT * FROM users WHERE id = ${user.data.user.id}`
      ); 
      
      return userData[0]; */

      return user;
    }),

  getUser: protectedProcedure.query((opts) => {
    const {
      ctx: { user },
    } = opts;

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Account not found",
      });
    }

    /** Logic to get the user data from DB */
    /* 
    const userData: User[] = await db.execute(
      sql`SELECT * FROM users WHERE id = ${user.id}`
    ); 

    return userData[0]; */

    return user;
  }),
});
