import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import {authController} from '@controllers/authController'
import {taskController} from '@controllers/taskController'
import  {handleErrorsAndDisconnect} from '@utils/dbFunctions'
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();

    // ... Tus consultas de Prisma van aquí.
  } catch (error) {
    handleErrorsAndDisconnect(prisma, error);
  }
}

main();


const app = new Elysia().get("/", () => "Hello Elysia")
.group('/api', app =>
app
.use(authController)
.use(taskController) 
)
.listen(Bun.env.PORT!);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

