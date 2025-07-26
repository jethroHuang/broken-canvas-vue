import type { App, Plugin } from 'vue'
import BrokenCanvas from './components/BrokenCanvas.vue'
import type { BrokenCanvasProps, BrokenCanvasInstance } from './types'

// 导出组件
export { BrokenCanvas }

// 导出组件类型
export type { BrokenCanvasProps, BrokenCanvasInstance }

// 创建 Vue 插件
export const BrokenCanvasPlugin: Plugin = {
  install: (app: App) => {
    app.component('BrokenCanvas', BrokenCanvas)
  }
}

// 导出默认插件
export default BrokenCanvasPlugin

// 导出组件类型别名
export type BrokenCanvasComponent = typeof BrokenCanvas