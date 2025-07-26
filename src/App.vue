<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BrokenCanvas from './components/BrokenCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'

// 控制参数
const displacementAmount = ref(7)
const animationSpeed = ref(1)
const enableAnimation = ref(false)
const noiseDensity = ref(0.5)
const displacementDirection = ref<'horizontal' | 'vertical' | 'both'>('both')
const blockSize = ref(3)
const text = ref('HELLO WORLD')

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 绘制文字到canvas
const drawText = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制文字
  ctx.fillStyle = '#333'
  ctx.font = '48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.value, canvas.width / 2, canvas.height / 2)
  console.log("绘制文字： ", text.value);

}

// 设置canvas大小与元素大小一致
const createCanvas = () => {
  canvasRef.value!.width = canvasRef.value!.clientWidth
  canvasRef.value!.height = canvasRef.value!.clientHeight
  drawText()
}

const handleUpdate = (_time: number) => {
  // console.log('动画时间:', _time)
}

// 监听文字变化，重新绘制
watch(text, () => {
  drawText()
})

onMounted(() => {
  createCanvas()
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Vue 破碎效果演示</h1>
      <p>使用置换图实现文字破碎效果</p>
    </header>
    
    <main class="main">
      <div class="canvas-container">
        
        <BrokenCanvas
          :displacement-amount="displacementAmount"
          :animation-speed="animationSpeed"
          :enable-animation="enableAnimation"
          :noise-density="noiseDensity" 
          :displacement-direction="displacementDirection"
          :block-size="blockSize"
          @update="handleUpdate"
        >
        <canvas ref="canvasRef" class="text-canvas"/>
        </BrokenCanvas>
      </div>
      
      <div class="controls-container">
        <ControlPanel
          :displacement-amount="displacementAmount"
          :animation-speed="animationSpeed"
          :enable-animation="enableAnimation"
          :noise-density="noiseDensity"
          :displacement-direction="displacementDirection"
          :block-size="blockSize"
          :text="text"
          @update:displacement-amount="displacementAmount = $event"
          @update:animation-speed="animationSpeed = $event"
          @update:enable-animation="enableAnimation = $event"
          @update:noise-density="noiseDensity = $event"
          @update:displacement-direction="displacementDirection = $event"
          @update:block-size="blockSize = $event"
          @update:text="text = $event"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.text-canvas {
  width: 100%;
  height: 100%;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 300;
}

.header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.main {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}

.canvas-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.controls-container {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .main {
    flex-direction: column;
  }
  
  .controls-container {
    order: -1;
  }
}
</style>
