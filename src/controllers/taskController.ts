import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { handleErrorsAndDisconnect } from "@utils/dbFunctions";
const prisma = new PrismaClient();

// Función para verificar si el token es válido

export const taskController = new Elysia().group("/task", (app) =>
  app
    .post(
      "/createTask",
      async ({ body, set }) => {
        try {
          const { title, description, creationDate, dueDate, completed, user } =
            body;
          console.log(body);

          const dbUser = await prisma.users.findFirst({
            where: {
              OR: [
                {
                  email: user,
                },
                {
                  username: user,
                },
              ],
            },
            select: {
              id: true,
            },
          });

          if (!dbUser) {
            set.status = 400;
            console.log("User not found");
            return { status: 404, msg: "User not", data: null };
          }

          const taskExists = await prisma.tasks.findFirst({ where: { title } });

          if (taskExists) {
            console.log("Task already exists");
            return { status: 409, msg: "Task Already Exists", data: null };
          }

          prisma.tasks
            .create({
              data: {
                title,
                description,
                creationDate: new Date(creationDate),
                dueDate,
                completed,
                userId: dbUser.id,
              },
            })
            .catch((error) => {
              console.log("Error creating task:", error);
            })
            .finally(() => {
              console.log("Task created successfully");
              return {
                status: 200,
                msg: "Task created successfully",
                data: null,
              };
            });
        } catch (error) {
          handleErrorsAndDisconnect(prisma, error);
        }
      },
      {
        body: t.Object({
          title: t.String(),
          description: t.String(),
          creationDate: t.Any(),
          dueDate: t.Any(),
          completed: t.Boolean(),
          user: t.String(),
        }),
      }
    )
    .put(
      "/taskUpdate",
      async ({ body, set }) => {
        try {
          const { id, title, description, dueDate, completed, user } = body;
          console.log(body);

          const dbUser = await prisma.users.findFirst({
            where: {
              OR: [
                {
                  email: user,
                },
                {
                  username: user,
                },
              ],
            },
            select: {
              id: true,
            },
          });

          if (!dbUser) {
            set.status = 400;
            console.log("User not found");
            return { status: 404, msg: "User not found", data: null };
          }

          const dbTask = await prisma.tasks.findUnique({ where: { id } });

          if (!dbTask) {
            console.log("A task with this name already exists");
            return {
              status: 409,
              msg: "A task with this name already exists",
              data: null,
            };
          }

          prisma.tasks.update({
            where: { id },
            data: { title, dueDate, description, completed },
          }).catch((error) => {
            console.log("Error updating task:", error);
          })
          .finally(() => {
            console.log("Task updated successfully");
            return {
              status: 200,
              msg: "Task updated successfully",
              data: null,
            };
          });


          
        } catch (error) {
          handleErrorsAndDisconnect(prisma, error);
        }
      },
      {
        body: t.Object({
          id: t.Integer(),
          title: t.String(),
          description: t.String(),
          dueDate: t.Any(),
          completed: t.Boolean(),
          user: t.String(),
        }),
      }
    )
    .get('/allTasks', async (ctx) => {
        try {
          const tasks = await prisma.tasks.findMany();
          
          if (tasks.length === 0) {
            return {
              status: 404,
              msg: 'No tasks found',
              data: null,
            };
          }
          
          return {
            status: 200,
            msg: 'Tasks fetched successfully',
            data: tasks,
          };
        } catch (error) {
          handleErrorsAndDisconnect(prisma, error);
          return {
            status: 500,
            msg: 'Error fetching tasks',
            data: null,
          };
        }
      })
      
);
