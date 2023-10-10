export async function handleErrorsAndDisconnect(prisma: any, error: any) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }