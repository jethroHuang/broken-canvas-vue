# Broken Canvas Vue

Vue3 破碎画布效果组件

## 特性

- 🎨 支持自定义破碎效果
- 🚀 轻量级实现
- 💪 TypeScript 支持
- 🔄 支持动画效果
- 🛠 可调节破碎参数

## 安装

```bash
npm install broken-canvas-vue
# 或
yarn add broken-canvas-vue
# 或
pnpm add broken-canvas-vue
```

## 使用

### 基础用法

```vue
<template>
  <div style="width: 300px; height: 200px">
    <BrokenCanvas
      :displacement-amount="50"
      :animation-speed="2"
      :enable-animation="true"
      :noise-density="0.5"
      displacement-direction="both"
      :block-size="5"
    >
      <!-- 放置你的canvas元素或图片在这里 -->
      <canvas width="300" height="200" />
    </BrokenCanvas>
  </div>
</template>

<script setup lang="ts">
import { BrokenCanvas } from 'broken-canvas-vue'
</script>
```

### 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import BrokenCanvasPlugin from 'broken-canvas-vue'

const app = createApp(App)
app.use(BrokenCanvasPlugin)
app.mount('#app')
```

## API

### Props

| 属性名 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| displacementAmount | number | 50 | 置换强度，取值范围：0-100 |
| animationSpeed | number | 1 | 动画速度，取值范围：0-5 |
| enableAnimation | boolean | false | 是否开启动画 |
| noiseDensity | number | 0.5 | 破碎密度，取值范围：0-1 |
| displacementDirection | 'horizontal' \| 'vertical' \| 'both' | 'both' | 破碎方向 |
| blockSize | number | 5 | 破碎块大小系数，取值范围：1-10 |

### 事件

| 事件名 | 参数 | 描述 |
| --- | --- | --- |
| update | (time: number) | 动画更新时触发，返回当前时间值 |

### 插槽

组件需要通过默认插槽提供一个canvas元素或图像作为源内容。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建组件库
pnpm build

# 查看演示
cd demo && pnpm dev

# 运行测试
pnpm test

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 项目结构

```
broken-canvas-vue/
├── src/                    # 源代码
│   ├── components/         # Vue 组件
│   │   ├── BrokenCanvas.vue # 主组件
│   │   └── ControlPanel.vue # 控制面板组件
│   ├── lib/                # 核心逻辑
│   │   └── DisplacementEffect.ts # 置换效果实现
│   ├── types/              # 类型定义
│   └── index.ts            # 入口文件
├── demo/                   # 演示项目
├── dist/                   # 构建产物
└── README.md
```

## 浏览器兼容性

此组件依赖于现代浏览器API，支持所有主流的现代浏览器，包括：

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

MIT
