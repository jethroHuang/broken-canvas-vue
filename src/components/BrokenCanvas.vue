<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue'
import { DisplacementEffect } from '../lib/DisplacementEffect'

// 定义组件Props类型
export interface BrokenCanvasProps {
  displacementAmount?: number // 置换强度：0-100
  animationSpeed?: number // 动画速度：0-5
  enableAnimation?: boolean // 是否开启动画：bool
  noiseDensity?: number // 破碎密度：0-1
  displacementDirection?: 'horizontal' | 'vertical' | 'both' // 破碎方向
  blockSize?: number // 破碎块大小系数：1-10
}

const props = withDefaults(defineProps<BrokenCanvasProps>(), {
  displacementAmount: 50,
  animationSpeed: 1,
  enableAnimation: false,
  noiseDensity: 0.5,
  displacementDirection: 'both',
  blockSize: 5
})

const emit = defineEmits<{
  update: [time: number]
}>()


const slotRef = ref<HTMLElement | null>(null)
const sourceCanvasRef = ref<HTMLCanvasElement | null>(null)
const displayCanvasRef = ref<HTMLCanvasElement | null>(null)
const displacementEffect = ref<DisplacementEffect | null>(null)
const animationId = ref<number | null>(null)
const time = ref(0)
const isAnimating = ref(false)

// 初始化置换效果
const initDisplacementEffect = () => {
  if (!sourceCanvasRef.value || !displayCanvasRef.value) return
  
  // 创建置换效果，使用显示canvas
  displacementEffect.value = new DisplacementEffect(displayCanvasRef.value, {
    displacementAmount: props.displacementAmount,
    onUpdate: () => {
      emit('update', time.value)
    }
  })
  
  // 设置原始图像为源canvas
  displacementEffect.value.setImage(sourceCanvasRef.value)
  
  // 生成初始置换图
  generateDisplacementMap()
}

// 生成置换图
const generateDisplacementMap = () => {
  if (!displacementEffect.value || !displayCanvasRef.value) return
  
  const width = displayCanvasRef.value.width
  const height = displayCanvasRef.value.height
  
  // 根据密度和块大小生成噪声图
  const scale = props.noiseDensity * props.blockSize
  const imageData = generateNoiseMap(width, height, scale, time.value)
  
  displacementEffect.value.setDisplacementMap(imageData)
  displacementEffect.value.render()
}

// 生成噪声置换图
const generateNoiseMap = (width: number, height: number, scale: number, time: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  const imageData = ctx!.createImageData(width, height)
  const data = imageData.data

  // 改进的随机函数
  const seed = Math.floor(time * 10)
  let callCount = 0
  const random = (min: number, max: number) => {
    callCount++
    const x1 = Math.sin(seed + callCount * 0.1) * 10000
    const x2 = Math.cos(seed * 0.5 + callCount * 0.3) * 10000
    const x3 = Math.sin(seed * 0.3 + callCount * 0.7) * 10000
    const combined = (x1 + x2 + x3) / 3
    return min + (combined - Math.floor(combined)) * (max - min)
  }

  // 生成随机方块
  const numSquares = Math.floor(random(15 * scale, 30 * scale))
  const squares = []
  
  for (let i = 0; i < numSquares; i++) {
    const square = {
      x: random(0, width),
      y: random(0, height),
      width: random(15, 50) * props.blockSize,
      height: random(15, 50) * props.blockSize,
      color: random(0, 1) > 0.5 ? 255 : 0
    }
    squares.push(square)
  }

  // 填充图像数据
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      let pixelValue = 128 // 默认灰色
      
      for (const square of squares) {
        if (x >= square.x && x < square.x + square.width &&
            y >= square.y && y < square.y + square.height) {
          pixelValue = square.color
          break
        }
      }
      
      // 根据方向设置位移
      if (props.displacementDirection === 'horizontal') {
        data[index] = pixelValue     // 红色通道（水平位移）
        data[index + 1] = 128       // 绿色通道（垂直位移）- 中性值
      } else if (props.displacementDirection === 'vertical') {
        data[index] = 128           // 红色通道（水平位移）- 中性值
        data[index + 1] = pixelValue // 绿色通道（垂直位移）
      } else {
        data[index] = pixelValue     // 红色通道（水平位移）
        data[index + 1] = pixelValue // 绿色通道（垂直位移）
      }
      
      data[index + 2] = 128        // 蓝色通道（未使用）
      data[index + 3] = 255        // Alpha通道
    }
  }

  return imageData
}

// 动画循环
const animate = () => {
  if (!isAnimating.value) return
  
  time.value += 0.05 * props.animationSpeed
  generateDisplacementMap()
  
  animationId.value = requestAnimationFrame(animate)
}

// 开始动画
const startAnimation = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  
  // 显示组件的canvas，隐藏源canvas
  if (sourceCanvasRef.value && displayCanvasRef.value) {
    sourceCanvasRef.value.style.visibility = 'hidden'
    displayCanvasRef.value.style.visibility = 'visible'
  }
  
  animate()
}

// 停止动画
const stopAnimation = () => {
  isAnimating.value = false
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
  
  // 显示源canvas，隐藏组件的canvas
  if (sourceCanvasRef.value && displayCanvasRef.value) {
    sourceCanvasRef.value.style.visibility = 'visible'
    displayCanvasRef.value.style.visibility = 'hidden'
  }
}

// 监听props变化
watch(() => props.displacementAmount, (newValue) => {
  if (displacementEffect.value) {
    displacementEffect.value.setDisplacementAmount(newValue)
    displacementEffect.value.render()
  }
})

watch(() => props.animationSpeed, (_newValue) => {
  // 动画速度变化时，如果正在动画，重新开始
  if (isAnimating.value) {
    stopAnimation()
    startAnimation()
  }
})

watch(() => props.enableAnimation, (newValue) => {
  if (newValue) {
    startAnimation()
  } else {
    stopAnimation()
  }
})

watch([() => props.noiseDensity, () => props.blockSize, () => props.displacementDirection], () => {
  generateDisplacementMap()
})

onMounted(async () => {
  // 等待下一个tick，确保slot内容已经渲染
  await nextTick()
  
  // 查找slot中的canvas元素
  if (slotRef.value) {
    const sourceCanvas = slotRef.value.querySelector('canvas')
    if (sourceCanvas) {
      sourceCanvasRef.value = sourceCanvas
      
      // 创建显示canvas，与源canvas相同大小
      const displayCanvas = document.createElement('canvas')
      displayCanvas.width = sourceCanvas.width
      displayCanvas.height = sourceCanvas.height
      displayCanvas.style.position = 'absolute'
      displayCanvas.style.top = '0'
      displayCanvas.style.left = '0'
      displayCanvas.style.zIndex = '1'
      
      // 将显示canvas添加到容器中
      slotRef.value.appendChild(displayCanvas)
      displayCanvasRef.value = displayCanvas
      
      // 初始状态：显示源canvas，隐藏组件的canvas
      sourceCanvas.style.visibility = 'visible'
      displayCanvas.style.visibility = 'hidden'
      
      initDisplacementEffect()
      
      // 如果开启动画，立即开始
      if (props.enableAnimation) {
        startAnimation()
      }
    }
  }
})

onUnmounted(() => {
  stopAnimation()
  if (displacementEffect.value) {
    displacementEffect.value.destroy()
  }
})
</script>

<template>
  <div ref="slotRef" class="broken-canvas-container" style="position: relative;">
    <slot />
  </div>
</template>
