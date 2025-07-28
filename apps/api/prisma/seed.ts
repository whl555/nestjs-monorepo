/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, CardType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建示例用户
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'password123', // 在实际应用中应该加密
    },
  });

  // 创建示例卡片
  const cards = [
    {
      title: '欢迎使用卡片系统',
      description: '这是一个文本卡片示例',
      type: CardType.TEXT,
      config: JSON.stringify({
        text: {
          content: '欢迎使用我们的可配置卡片系统！这个系统支持多种卡片类型，您可以自由配置和排列。',
          fontSize: 18,
          color: '#2c3e50',
          alignment: 'center',
        },
        style: {
          backgroundColor: '#ecf0f1',
          borderRadius: 12,
          padding: 20,
          shadow: true,
        },
      }),
      position: 0,
      userId: user.id,
    },
    {
      title: '项目统计',
      description: '显示项目相关数据',
      type: CardType.STATS,
      config: JSON.stringify({
        stats: {
          value: 1247,
          label: '总用户数',
          trend: 'up',
          percentage: 23,
        },
        style: {
          backgroundColor: '#e8f5e8',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      }),
      position: 1,
      userId: user.id,
    },
    {
      title: '团队待办事项',
      description: '当前项目的任务列表',
      type: CardType.TODO,
      config: JSON.stringify({
        todo: {
          items: [
            { id: '1', text: '完成卡片系统设计', completed: true },
            { id: '2', text: '实现前端界面', completed: false },
            { id: '3', text: '添加移动端支持', completed: false },
            { id: '4', text: '编写文档', completed: false },
          ],
          showCompleted: true,
        },
        style: {
          backgroundColor: '#fff8e1',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      }),
      position: 2,
      userId: user.id,
    },
    {
      title: '快速链接',
      description: '常用链接集合',
      type: CardType.LINK,
      config: JSON.stringify({
        link: {
          url: 'https://github.com',
          title: 'GitHub',
          description: '全球最大的代码托管平台',
          favicon: 'https://github.com/favicon.ico',
        },
        style: {
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      }),
      position: 3,
      userId: user.id,
    },
    {
      title: '示例图片',
      description: '展示图片卡片功能',
      type: CardType.IMAGE,
      config: JSON.stringify({
        image: {
          url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
          alt: '编程代码示例',
          objectFit: 'cover',
        },
        style: {
          borderRadius: 12,
          shadow: true,
        },
      }),
      position: 4,
      userId: user.id,
    },
  ];

  // 批量创建卡片
  for (const cardData of cards) {
    await prisma.card.upsert({
      where: { id: `demo-card-${cardData.position}` },
      update: cardData,
      create: {
        id: `demo-card-${cardData.position}`,
        ...cardData,
      },
    });
  }

  // 创建卡片模板
  const templates = [
    {
      id: 'template-text',
      name: '文本卡片模板',
      type: CardType.TEXT,
      defaultConfig: JSON.stringify({
        text: {
          content: '在这里输入您的文本内容',
          fontSize: 16,
          color: '#333333',
          alignment: 'left',
        },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      }),
      description: '用于显示文本内容的基础模板',
    },
    {
      id: 'template-stats',
      name: '统计卡片模板',
      type: CardType.STATS,
      defaultConfig: JSON.stringify({
        stats: {
          value: 0,
          label: '统计指标',
          trend: 'neutral',
          percentage: 0,
        },
        style: {
          backgroundColor: '#f0f7ff',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      }),
      description: '用于展示数据统计的模板',
    },
  ];

  for (const template of templates) {
    await prisma.cardTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  console.log('数据库种子数据创建完成！');
  console.log(`创建了用户: ${user.email}`);
  console.log(`创建了 ${cards.length} 个示例卡片`);
  console.log(`创建了 ${templates.length} 个卡片模板`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
