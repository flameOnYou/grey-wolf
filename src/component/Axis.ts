import { getPixelRatio } from '../utils/canvas'
import ChartData from '../data/ChartData';


 //刻度单位
export  class Tick{
  v:any  // 刻度显示的字符串
  x:number  // 对应的canvas上的坐标
  oV:number // 对应的值
  y!:number

  constructor(v:string, x:number, oV:number){
    this.v = v;
    this.x = x
    this.oV = oV
  }
}

/**
 * 坐标轴
 */
export default abstract class Axis {

  _chartData: ChartData;
  _width: number;
  _height: number;
  _minValue: number;
  _maxValue: number;
  _range: number;
  _ticks: Array<Tick>;

  _measureCtx!: CanvasRenderingContext2D;

  constructor(chartData: ChartData) {
    this._chartData = chartData
    this._width = 0
    this._height = 0
    this._minValue = 0
    this._maxValue = 0
    this._range = 0
    this._ticks = []
    this._initMeasureCanvas()
  }

  _initMeasureCanvas() {
    const measureCanvas = document.createElement('canvas')
    this._measureCtx = <CanvasRenderingContext2D>measureCanvas.getContext('2d')
    const pixelRatio = getPixelRatio(this._measureCtx)
    this._measureCtx.scale(pixelRatio, pixelRatio)
  }

  min() {
    return this._minValue
  }

  max() {
    return this._maxValue
  }

  setWidth(width: number) {
    this._width = width
  }

  setHeight(height: number) {
    this._height = height
  }

  /**
   * 获取ticks
   * @returns {[]|*[]}
   */
  ticks() {
    return this._ticks
  }

  /**
   * 计算轴
   */
  computeAxis() {
    const { min, max, range } = this._computeMinMaxValue()
    this._minValue = min
    this._maxValue = max
    this._range = range
    this._ticks = this._computeOptimalTicks(this._computeTicks())
  }

  /**
   * 计算最大最小值
   */
  _computeMinMaxValue() {
    const min = 0
    const max = 0
    const range = 0
    return { min, max, range }
   }

  /**
   * 计算最佳的tick
   * @param ticks
   */
  public abstract _computeOptimalTicks(ticks:any) : Array<Tick>

  /**
   * 计算轴上的tick值
   */
  _computeTicks() {
    const ticks = []
    if (this._range >= 0) {
      const interval = +this._nice(this._range / 8.0)
      const precision = this._getIntervalPrecision(interval)
      const first = +this._round(Math.ceil(this._minValue / interval) * interval, precision)
      const last = +this._round(Math.floor(this._maxValue / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= last) {
          ticks[n] = { v: f.toFixed(precision) }
          ++n
          f += interval
        }
      }
    }
    return ticks
  }

  _nice(value:number) {
    const exponent = Math.floor(Math.log(value) / Math.LN10)
    const exp10 = Math.pow(10.0, exponent)
    const f = value / exp10 // 1 <= f < 10
    let nf = 0
    if (f < 1.5) {
      nf = 1
    } else if (f < 2.5) {
      nf = 2
    } else if (f < 3.5) {
      nf = 3
    } else if (f < 4.5) {
      nf = 4
    } else if (f < 5.5) {
      nf = 5
    } else if (f < 6.5) {
      nf = 6
    } else {
      nf = 8
    }
    value = nf * exp10
    return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
  }

  _getIntervalPrecision(value:any) {
    const str = value.toString()

    // Consider scientific notation: '3.4e-12' '3.4e+12'
    const eIndex = str.indexOf('e')
    if (eIndex > 0) {
      const precision = +str.slice(eIndex + 1)
      return precision < 0 ? -precision : 0
    } else {
      const dotIndex = str.indexOf('.')
      return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
    }
  }

  _round(x:any, precision:any) {
    if (precision == null) {
      precision = 10
    }
    precision = Math.min(Math.max(0, precision), 20)
    x = (+x).toFixed(precision)
    return x
  }
}
