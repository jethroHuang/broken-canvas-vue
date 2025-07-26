<script setup lang="ts">


interface Props {
  displacementAmount: number
  animationSpeed: number
  enableAnimation: boolean
  noiseDensity: number
  displacementDirection: 'horizontal' | 'vertical' | 'both'
  blockSize: number
  text: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:displacementAmount': [value: number]
  'update:animationSpeed': [value: number]
  'update:enableAnimation': [value: boolean]
  'update:noiseDensity': [value: number]
  'update:displacementDirection': [value: 'horizontal' | 'vertical' | 'both']
  'update:blockSize': [value: number]
  'update:text': [value: string]
}>()

const directionOptions = [
  { label: '仅水平', value: 'horizontal' },
  { label: '仅垂直', value: 'vertical' },
  { label: '水平+垂直', value: 'both' }
]
</script>

<template>
  <div class="control-panel">
    <h3>破碎效果控制面板</h3>
    
    <div class="control-group">
      <label>文字内容：</label>
      <input 
        type="text" 
        :value="text"
        @input="emit('update:text', ($event.target as HTMLInputElement).value)"
        placeholder="输入要显示的文字"
      />
    </div>
    
    <div class="control-group">
      <label>置换强度：{{ displacementAmount }}</label>
      <input 
        type="range" 
        :value="displacementAmount"
        @input="emit('update:displacementAmount', Number(($event.target as HTMLInputElement).value))"
        min="0" 
        max="100" 
        step="1"
      />
    </div>
    
    <div class="control-group">
      <label>动画速度：{{ animationSpeed }}</label>
      <input 
        type="range" 
        :value="animationSpeed"
        @input="emit('update:animationSpeed', Number(($event.target as HTMLInputElement).value))"
        min="0" 
        max="5" 
        step="0.1"
      />
    </div>
    
    <div class="control-group">
      <label>
        <input 
          type="checkbox" 
          :checked="enableAnimation"
          @change="emit('update:enableAnimation', ($event.target as HTMLInputElement).checked)"
        />
        开启动画
      </label>
    </div>
    
    <div class="control-group">
      <label>破碎密度：{{ noiseDensity }}</label>
      <input 
        type="range" 
        :value="noiseDensity"
        @input="emit('update:noiseDensity', Number(($event.target as HTMLInputElement).value))"
        min="0" 
        max="1" 
        step="0.1"
      />
    </div>
    
    <div class="control-group">
      <label>破碎方向：</label>
      <select 
        :value="displacementDirection"
        @change="emit('update:displacementDirection', ($event.target as HTMLSelectElement).value as 'horizontal' | 'vertical' | 'both')"
      >
        <option 
          v-for="option in directionOptions" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    
    <div class="control-group">
      <label>破碎块大小：{{ blockSize }}</label>
      <input 
        type="range" 
        :value="blockSize"
        @input="emit('update:blockSize', Number(($event.target as HTMLInputElement).value))"
        min="1" 
        max="10" 
        step="1"
      />
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.control-panel h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.control-group input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  margin: 5px 0;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.control-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}
</style> 