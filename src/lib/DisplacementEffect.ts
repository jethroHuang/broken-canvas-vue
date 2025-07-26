/**
 * 置换效果类 - 专注于置换效果渲染，不处理图像加载和创建
 * 实现类似After Effects的置换效果
 */

export interface DisplacementEffectOptions {
    displacementAmount?: number;
    previewCanvas?: HTMLCanvasElement | null;
    onUpdate?: (() => void) | null;
}

export type ImageSource = HTMLCanvasElement | HTMLImageElement | string;
export type DisplacementMapSource = HTMLCanvasElement | ImageData | string;

export class DisplacementEffect {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private displacementAmount: number;
    private previewCanvas: HTMLCanvasElement | null;
    private originalImage: HTMLCanvasElement | null;
    private displacementMap: HTMLCanvasElement | null;
    private onUpdate: (() => void) | null;

    /**
     * @param canvas - 主画布元素
     * @param options - 配置选项
     * @param options.displacementAmount - 置换强度 (0-100)
     * @param options.previewCanvas - 置换图预览画布（可选）
     */
    constructor(canvas: HTMLCanvasElement, options: DisplacementEffectOptions = {}) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('无法获取2D渲染上下文');
        }
        this.ctx = context;
        
        // 配置参数
        this.displacementAmount = options.displacementAmount || 50;
        this.previewCanvas = options.previewCanvas || null;
        
        // 内部状态
        this.originalImage = null;
        this.displacementMap = null;
        
        // 事件回调
        this.onUpdate = options.onUpdate || null;
    }

    /**
     * 设置原始图像
     * @param source - 图像源
     */
    setImage(source: ImageSource): void {
        if (typeof source === 'string') {
            // 处理Data URL或图片URL
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = this.canvas.width;
                canvas.height = this.canvas.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    this.originalImage = canvas;
                    this.render(); // 重新渲染
                }
            };
            img.onerror = (error: Event | string) => {
                console.error('图片加载失败:', error);
            };
            img.src = source;
        } else if (source instanceof HTMLImageElement) {
            // 从Image创建Canvas
            const canvas = document.createElement('canvas');
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
                this.originalImage = canvas;
            }
        } else if (source instanceof HTMLCanvasElement) {
            // Canvas对象
            this.originalImage = source;
        }
    }

    /**
     * 设置置换图
     * @param source - 置换图源
     */
    setDisplacementMap(source: DisplacementMapSource): void {
        if (typeof source === 'string') {
            // 处理Data URL或图片URL
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = this.canvas.width;
                canvas.height = this.canvas.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    this.displacementMap = canvas;
                    this.displayDisplacementMap();
                    this.render(); // 重新渲染
                }
            };
            img.onerror = (error: Event | string) => {
                console.error('置换图加载失败:', error);
            };
            img.src = source;
        } else if (source instanceof HTMLCanvasElement) {
            // Canvas对象
            this.displacementMap = source;
        } else if (source instanceof ImageData) {
            // ImageData对象
            const canvas = document.createElement('canvas');
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.putImageData(source, 0, 0);
                this.displacementMap = canvas;
            }
        }
        
        this.displayDisplacementMap();
    }

    /**
     * 显示置换图预览
     */
    displayDisplacementMap(): void {
        if (!this.displacementMap || !this.previewCanvas) return;
        
        const ctx = this.previewCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(this.displacementMap, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
        }
    }

    /**
     * 渲染置换效果
     */
    render(): void {
        if (!this.originalImage) return;
        
        // 如果没有置换图，直接显示原图
        if (!this.displacementMap) {
            this.ctx.drawImage(this.originalImage, 0, 0);
            return;
        }

        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 获取原始图像数据
        const sourceCtx = this.originalImage.getContext('2d');
        if (!sourceCtx) return;
        const sourceData = sourceCtx.getImageData(0, 0, width, height);
        
        // 获取置换图数据
        const displacementCtx = this.displacementMap.getContext('2d');
        if (!displacementCtx) return;
        const displacementData = displacementCtx.getImageData(0, 0, width, height);
        
        // 创建输出图像数据
        const outputData = this.ctx.createImageData(width, height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                // 从置换图获取位移值
                const dispIndex = (y * width + x) * 4;
                const dispX = (displacementData.data[dispIndex] - 128) * this.displacementAmount / 128;
                const dispY = (displacementData.data[dispIndex + 1] - 128) * this.displacementAmount / 128;
                
                // 计算源坐标
                let srcX = x + dispX;
                let srcY = y + dispY;
                
                // 边界检查
                srcX = Math.max(0, Math.min(width - 1, srcX));
                srcY = Math.max(0, Math.min(height - 1, srcY));
                
                const srcIndex = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                
                // 复制像素
                outputData.data[index] = sourceData.data[srcIndex];
                outputData.data[index + 1] = sourceData.data[srcIndex + 1];
                outputData.data[index + 2] = sourceData.data[srcIndex + 2];
                outputData.data[index + 3] = sourceData.data[srcIndex + 3];
            }
        }
        
        this.ctx.putImageData(outputData, 0, 0);
        
        // 触发更新回调
        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    /**
     * 设置置换强度
     * @param amount - 强度值 (0-100)
     */
    setDisplacementAmount(amount: number): void {
        this.displacementAmount = Math.max(0, Math.min(100, amount));
    }

    /**
     * 获取当前置换强度
     */
    getDisplacementAmount(): number {
        return this.displacementAmount;
    }

    /**
     * 销毁实例，清理资源
     */
    destroy(): void {
        this.canvas = null as any;
        this.ctx = null as any;
        this.originalImage = null;
        this.displacementMap = null;
        this.previewCanvas = null;
        this.onUpdate = null;
    }
} 