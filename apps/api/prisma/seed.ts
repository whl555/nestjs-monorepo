/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: '123',
      tasks: {
        create: [
          {
            title: '完成项目提案',
            description: '为新产品编写详细的项目计划书',
            status: 'DONE',
          },
          {
            title: '学习Prisma',
            description: '深入研究Prisma ORM的使用方法',
            status: 'IN_PROGRESS',
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      password: '123',
      tasks: {
        create: [
          {
            title: '晨跑5公里',
            description: '每天早上6点进行晨跑锻炼',
            status: 'OPEN',
          },
          {
            title: '准备会议材料',
            description: '为下周的客户会议准备演示文稿',
            status: 'IN_PROGRESS',
          },
          {
            title: '阅读新书',
            description: '完成《设计模式》第5章的阅读',
            status: 'DONE',
          },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie',
      password: '123',
      tasks: {
        create: [
          {
            title: '购买食材',
            description: '牛奶、鸡蛋、面包和水果',
            status: 'OPEN',
          },
        ],
      },
    },
  });

  // 创建一个没有任务的用户
  const user4 = await prisma.user.create({
    data: {
      email: 'dave@example.com',
      name: 'Dave',
      password: '123',
    },
  });

  // 查询所有用户及其任务
  const usersWithTasks = await prisma.user.findMany({
    include: {
      tasks: true,
    },
  });

  console.dir(usersWithTasks, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
