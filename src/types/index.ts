// 组件类型导出
export interface BrokenCanvasProps {
  displacementAmount?: number // 置换强度：0-100
  animationSpeed?: number // 动画速度：0-5
  enableAnimation?: boolean // 是否开启动画：bool
  noiseDensity?: number // 破碎密度：0-1
  displacementDirection?: 'horizontal' | 'vertical' | 'both' // 破碎方向
  blockSize?: number // 破碎块大小系数：1-10
}

// 组件实例类型
export interface BrokenCanvasInstance {
  // 可以添加组件实例的方法类型
} 