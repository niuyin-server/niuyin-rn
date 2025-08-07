import { Collection, Comment, Work } from '@/types';

// 模拟网络请求延迟
export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟作品数据
export const mockWorks: Work[] = [
  {
    id: '1',
    title: 'React Native 性能优化最佳实践',
    type: 'text',
    content: `# React Native 性能优化指南

## 1. 列表优化
使用 FlatList 和 VirtualizedList 来处理大量数据，避免一次性渲染所有项目。

## 2. 图片优化
- 使用适当的图片格式和尺寸
- 实现图片懒加载
- 使用缓存机制

## 3. 状态管理
合理使用 useState 和 useEffect，避免不必要的重新渲染。

## 4. 内存管理
及时清理定时器和事件监听器，防止内存泄漏。`,
    images: ['https://picsum.photos/400/500'],
    author: {
      id: 'u1',
      name: '前端小王',
      avatar: 'https://i.pravatar.cc/100?u=1',
      isFollowed: false
    },
    stats: {
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      isCollected: false
    },
    tags: ['React Native', '性能优化', '前端开发'],
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: '美食摄影技巧分享',
    type: 'image',
    content: '分享一些美食摄影的小技巧，让你的美食照片更加诱人！',
    images: [
      'https://picsum.photos/400/600?random=1',
      'https://picsum.photos/400/600?random=2',
      'https://picsum.photos/400/600?random=3'
    ],
    author: {
      id: 'u2',
      name: '美食达人小李',
      avatar: 'https://i.pravatar.cc/100?u=2',
      isFollowed: true
    },
    stats: {
      likes: 567,
      comments: 89,
      shares: 34,
      isLiked: true,
      isCollected: false
    },
    tags: ['摄影', '美食', '技巧'],
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    title: 'TypeScript 进阶教程',
    type: 'video',
    content: '深入学习 TypeScript 的高级特性，提升代码质量和开发效率。',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    images: ['https://picsum.photos/400/300?random=4'],
    author: {
      id: 'u3',
      name: '编程导师张老师',
      avatar: 'https://i.pravatar.cc/100?u=3',
      isFollowed: false
    },
    stats: {
      likes: 892,
      comments: 156,
      shares: 67,
      isLiked: false,
      isCollected: true
    },
    tags: ['TypeScript', '编程', '教程'],
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: '极简主义生活方式',
    type: 'text',
    content: `# 极简主义：少即是多

## 什么是极简主义？
极简主义不是简单的减少物品，而是专注于真正重要的事物。

## 实践方法
1. **断舍离**：定期清理不需要的物品
2. **专注核心**：将精力投入到最重要的事情上
3. **质量优于数量**：选择高质量的物品和体验

## 带来的好处
- 减少焦虑和压力
- 提高专注力
- 节省时间和金钱
- 获得内心平静`,
    images: ['https://picsum.photos/400/450?random=5'],
    author: {
      id: 'u4',
      name: '生活美学家',
      avatar: 'https://i.pravatar.cc/100?u=4',
      isFollowed: false
    },
    stats: {
      likes: 445,
      comments: 78,
      shares: 23,
      isLiked: false,
      isCollected: false
    },
    tags: ['生活方式', '极简主义', '心理健康'],
    createdAt: '2024-01-12T14:45:00Z'
  }
];

// 生成更多模拟数据
export const generateMoreWorks = (page: number = 2, count: number = 10): Work[] => {
  const types: ('text' | 'image' | 'video')[] = ['text', 'image', 'video'];
  const titles = [
    'JavaScript 异步编程详解',
    '旅行摄影心得分享',
    'UI设计趋势分析',
    '健康饮食搭配指南',
    'Python 数据分析实战',
    '手机摄影构图技巧',
    '产品设计思维方法',
    '瑜伽入门基础教程',
    'Vue.js 组件化开发',
    '数字绘画技巧分享',
    '投资理财入门指南',
    '咖啡冲泡艺术',
    'Node.js 后端开发',
    '室内设计美学',
    '健身训练计划',
    '烘焙制作秘诀',
    'Flutter 跨平台开发',
    '插画创作心得',
    '时间管理方法',
    '园艺种植技巧',
    'AI 人工智能应用',
    '音乐制作入门',
    '写作技巧提升',
    '摄影后期处理'
  ];

  const contents = [
    '深入探讨现代前端开发的核心概念和最佳实践，帮助开发者提升技能水平。',
    '分享多年来在各地旅行中积累的摄影经验，教你如何捕捉最美的瞬间。',
    '分析当前设计行业的最新趋势，为设计师提供创作灵感和方向指导。',
    '科学搭配营养餐食，让你在享受美味的同时保持健康的生活状态。',
    '通过实际案例学习数据分析技能，掌握从数据中挖掘价值的方法。',
    '用手机也能拍出专业级照片，掌握构图技巧让你的作品脱颖而出。',
    '以用户为中心的设计思维，创造真正有价值的产品和服务体验。',
    '从零开始学习瑜伽，改善身体柔韧性，找到内心的平静与和谐。'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const globalIndex = (page - 1) * count + index;
    const typeIndex = globalIndex % types.length;
    const titleIndex = globalIndex % titles.length;
    const contentIndex = globalIndex % contents.length;
    
    // 随机高度，用于瀑布流效果
    const randomHeight = Math.floor(Math.random() * 200) + 300; // 300-500px
    
    return {
      id: `work_${page}_${index + 1}`,
      title: titles[titleIndex],
      type: types[typeIndex],
      content: contents[contentIndex],
      images: types[typeIndex] === 'image' ? [
        `https://picsum.photos/400/${randomHeight}?random=${globalIndex * 2}`,
        `https://picsum.photos/400/${randomHeight}?random=${globalIndex * 2 + 1}`
      ] : types[typeIndex] === 'video' ? [
        `https://picsum.photos/400/${Math.floor(randomHeight * 0.75)}?random=${globalIndex * 2}`
      ] : [
        `https://picsum.photos/400/${randomHeight}?random=${globalIndex * 2}`
      ],
      videoUrl: types[typeIndex] === 'video' ? 
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : undefined,
      author: {
        id: `user_${globalIndex + 1}`,
        name: `创作者${globalIndex + 1}号`,
        avatar: `https://i.pravatar.cc/100?u=${globalIndex + 10}`,
        isFollowed: Math.random() > 0.7
      },
      stats: {
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        shares: Math.floor(Math.random() * 50) + 1,
        isLiked: Math.random() > 0.8,
        isCollected: Math.random() > 0.9
      },
      tags: [`标签${(globalIndex % 5) + 1}`, `分类${(globalIndex % 3) + 1}`],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

// 模拟评论数据
export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: '小明',
    userAvatar: 'https://i.pravatar.cc/50?u=101',
    content: '写得很好，学到了很多！',
    createdAt: '2024-01-15T11:00:00Z',
    likes: 12,
    isLiked: false
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: '小红',
    userAvatar: 'https://i.pravatar.cc/50?u=102',
    content: '请问有相关的实战项目推荐吗？',
    createdAt: '2024-01-15T11:30:00Z',
    likes: 5,
    isLiked: true
  }
];

// 模拟收藏夹数据
export const mockCollections: Collection[] = [
  {
    id: 'col1',
    name: '前端开发',
    count: 23,
    coverImage: 'https://picsum.photos/200/200?random=201'
  },
  {
    id: 'col2',
    name: '设计灵感',
    count: 15,
    coverImage: 'https://picsum.photos/200/200?random=202'
  },
  {
    id: 'col3',
    name: '生活方式',
    count: 8,
    coverImage: 'https://picsum.photos/200/200?random=203'
  }
];

// API 模拟函数
export const fetchWorks = async (page: number = 1): Promise<Work[]> => {
  await delay();
  if (page === 1) {
    // 确保首页返回10条数据
    if (mockWorks.length < 10) {
      // 如果模拟数据不足10条，则生成额外的数据补足
      const additionalWorks = generateMoreWorks(1, 10 - mockWorks.length);
      return [...mockWorks, ...additionalWorks];
    }
    return mockWorks.slice(0, 10); // 限制为10条
  }
  return generateMoreWorks(page, 10); // 每次加载10条
};

export const fetchComments = async (workId: string): Promise<Comment[]> => {
  await delay();
  return mockComments;
};

export const fetchCollections = async (): Promise<Collection[]> => {
  await delay();
  return mockCollections;
};