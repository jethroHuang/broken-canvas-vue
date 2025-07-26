/// <reference types="vue" />

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BrokenCanvas: typeof import('./components/BrokenCanvas.vue')['default']
  }
}

export {} 