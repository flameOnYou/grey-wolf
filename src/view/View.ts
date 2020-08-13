import ChartData from "../data/ChartData"
import { getPixelRatio } from '../utils/canvas'

export const PlotType = {
    LINE: 'line',
    BAR: 'bar',
    CIRCLE: 'circle'
  }

export class View {

    container!:HTMLElement 
    _chartData!:ChartData
    _canvas!:HTMLCanvasElement 
    _ctx!:CanvasRenderingContext2D  | null
    _width:number = 0
    _height:number = 0
    requestAnimationId:number = 0

    constructor (container:HTMLElement, chartData:ChartData) {
      this._chartData = chartData
      this._initCanvas(container)
    }

    _initCanvas (container:HTMLElement) {
        this._canvas = <HTMLCanvasElement>document.createElement('canvas')
        this._canvas.style.position = 'absolute'
        this._canvas.style.top = '0'
        this._canvas.style.left = '0'
        this._canvas.style.zIndex = '2'
        this._ctx  = this._canvas.getContext('2d')
        container.appendChild(this._canvas)
      }

      /**
   * 重新绘制
   * @param extendFun
   * @private
   */
  _redraw (extendFun:any) {
    if(this._ctx == null){
        return
    }
    this._ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight)
    if (extendFun) {
      extendFun()
    }
    this._draw()
  }

  /**
   * 绘制
   */
  _draw () {
  }

  setWidth (width:number) {
    this._width = width
  }

  setHeight (height:number) {
    this._height = height
  }

  layout () {
    if (this._height !== this._canvas.offsetHeight || this._width !== this._canvas.offsetWidth) {
      this._redraw(() => {
        const pixelRatio = getPixelRatio(this._ctx)
        this._canvas.style.width = `${this._width}px`
        this._canvas.style.height = `${this._height}px`
        this._canvas.width = this._width * pixelRatio
        this._canvas.height = this._height * pixelRatio
        if(this._ctx == null){
            console.log('_ctx is null')
            return
        }
        this._ctx.scale(pixelRatio, pixelRatio)
      })
    } else {
      this.flush()
    }
  }

  /**
   * 刷新
   */
  flush () {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
    }
    this.requestAnimationId = requestAnimationFrame(() => {
      this._redraw(null)
    })
  }

  /**
   * 获取图片
   * @returns {HTMLCanvasElement}
   */
  getImage (): HTMLCanvasElement {
    return this._canvas
  }
}