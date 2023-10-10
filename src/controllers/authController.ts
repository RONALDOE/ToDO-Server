import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { handleErrorsAndDisconnect } from "@utils/dbFunctions";
import { cookie, SetCookieOptions } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import Bun from 'bun';

const prisma = new PrismaClient();

export const authController = new Elysia().group("/auth", (app) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .use(cookie())
    .get("/test", () => {
      return { message: "hola" };
    })
    .post(
      "/register",
      async ({ body, set }) => {
        try {
          const { username, password, email } = body;

          const existingUser = await prisma.users.findFirst({
            where: {
              OR: [
                {
                  email: username,
                },
                {
                  username,
                },
                {email}
              ],
            },
          });

          if (existingUser) {
            set.status = 400;
            return { status: 400, msg: "User already exists", data: null };
          }

          const hashedPassword = await Bun.password.hash(password);

          const newUser = await prisma.users.create({
            data: {
              username,
              password: hashedPassword,
              email
            },
          });

          return {
            status: 201,
            msg: "User created successfully",
            data: null,
          };
        } catch (error) {
          handleErrorsAndDisconnect(prisma, error);
          return {
            status: 500,
            msg: "Error creating user",
            data: null,
          };
        }
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
          email: t.String()
        }),
      }
    )
    .post(
      "/forgotPassword",
      async ({ body }) => {
        try {
          const { username } = body;

          // Aquí puedes implementar la lógica para recuperar la clave
          // por ejemplo, enviar un correo electrónico con un enlace para restablecer la contraseña

          return {
            status: 200,
            msg: "Password recovery email sent successfully",
            data: null,
          };
        } catch (error) {
          handleErrorsAndDisconnect(prisma, error);
          return {
            status: 500,
            msg: "Error sending password recovery email",
            data: null,
          };
        }
      },
      {
        body: t.Object({
          username: t.String(),
        }),
      }
    )
);
