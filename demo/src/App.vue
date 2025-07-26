<script setup>
import { BrokenCanvas } from 'broken-canvas-vue'
import { ref, onMounted } from 'vue'

const canvasRef = ref(null)
const text = ref('HELLO WORLD')

const createCanvas = () => {
  canvasRef.value.width = canvasRef.value.clientWidth
  canvasRef.value.height = canvasRef.value.clientHeight
}


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

onMounted(() => {
  createCanvas()
  drawText()
}) 
</script>

<template>
  <main class="main">
    <BrokenCanvas
    :displacement-amount="50" :animation-speed="1" :enable-animation="true" :noise-density="0.5" :displacement-direction="'horizontal'" :block-size="5">
      <canvas ref="canvasRef" class="text-canvas"/>
    </BrokenCanvas>
  </main>
</template>

<style>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
