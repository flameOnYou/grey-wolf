/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { View, PlotType } from './View'
import { YAxisPosition } from '../data/options/styleOptions'
import { calcTextWidth, drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { isValid } from '../utils/typeChecks'
import ChartData from '../data/ChartData'
import YAxis from '../component/YAxis'

// class additionalDataProvider{
//   technicalIndicator: this.technicalIndicator.bind(this),
//   chartType: this.chartType.bind(this),
//   tag: this.tag.bind(this)
// }

export default class YAxisView extends View {
  _ctx!: CanvasRenderingContext2D

  constructor(
    public container: HTMLElement,
    public chartData: ChartData,
    public _yAxis: YAxis,
    public _additionalDataProvider: any) {
    super(container, chartData)
  }

  _draw() {
    const yAxisOptions = this._chartData.styleOptions().yAxis
    if (yAxisOptions.display) {
      this._drawAxisLine(yAxisOptions)
      this._drawTickLines(yAxisOptions)
      this._drawTickLabels(yAxisOptions)
      this._drawTechnicalIndicatorLastValue(yAxisOptions)
      this._drawLastPriceLabel(yAxisOptions)
    }
  }

  _drawAxisLine(yAxisOptions: any) {
    const axisLine = yAxisOptions.axisLine
    if (!axisLine.display) {
      return
    }
    this._ctx.strokeStyle = axisLine.color
    this._ctx.lineWidth = axisLine.size
    let x
    if (this._isDrawFromStart(yAxisOptions)) {
      x = 0
    } else {
      x = this._width - 1
    }
    drawVerticalLine(this._ctx, x, 0, this._height)
  }

  _drawTickLines(yAxisOptions: any) {
    const tickLine = yAxisOptions.tickLine
    if (!tickLine.display) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const tickLineLength = tickLine.length

    let startX = 0
    let endX = 0
    if (this._isDrawFromStart(yAxisOptions)) {
      startX = 0
      if (yAxisOptions.axisLine.display) {
        startX += yAxisOptions.axisLine.size
      }
      endX = startX + tickLineLength
    } else {
      startX = this._width
      if (yAxisOptions.axisLine.display) {
        startX -= yAxisOptions.axisLine.size
      }
      endX = startX - tickLineLength
    }
    this._yAxis.ticks().forEach(tick => {
      drawHorizontalLine(this._ctx, tick.y, startX, endX)
    })
  }

  _drawTickLabels(yAxisOptions: any) {
    const tickText = yAxisOptions.tickText
    if (!tickText.display) {
      return
    }
    const tickLine = yAxisOptions.tickLine
    const tickLineDisplay = tickLine.display
    const tickLineLength = tickLine.length
    let labelX = 0
    if (this._isDrawFromStart(yAxisOptions)) {
      labelX = tickText.paddingLeft
      if (yAxisOptions.axisLine.display) {
        labelX += yAxisOptions.axisLine.size
      }
      if (tickLineDisplay) {
        labelX += tickLineLength
      }
      this._ctx.textAlign = 'left'
    } else {
      labelX = this._width - tickText.paddingRight
      if (yAxisOptions.axisLine.display) {
        labelX -= yAxisOptions.axisLine.size
      }
      if (tickLineDisplay) {
        labelX -= tickLineLength
      }
      this._ctx.textAlign = 'right'
    }
    this._ctx.textBaseline = 'middle'
    this._ctx.font = getFont(tickText.size, tickText.weight, tickText.family)
    this._ctx.fillStyle = tickText.color
    this._yAxis.ticks().forEach(tick => {
      this._ctx.fillText(tick.v, labelX, tick.y)
    })
    this._ctx.textAlign = 'left'
  }

  /**
   * 绘制技术指标最后值
   * @param yAxisOptions
   * @private
   */
  _drawTechnicalIndicatorLastValue(yAxisOptions: any) {
    const technicalIndicatorStyleOptions = this._chartData.styleOptions().technicalIndicator
    const lastValueMarkStyleOptions = technicalIndicatorStyleOptions.lastValueMark
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const technicalIndicatorResult = technicalIndicator.result
    const dataSize = technicalIndicatorResult.length
    const technicalIndicatorData = technicalIndicatorResult[dataSize - 1]
    if (!lastValueMarkStyleOptions.display || !technicalIndicatorData) {
      return
    }
    const dataList = this._chartData.dataList()
    const plots = technicalIndicator.plots
    const cbData = {
      preData: { kLineData: dataList[dataSize - 2], technicalIndicatorData: technicalIndicatorResult[dataSize - 2] },
      currentData: { kLineData: dataList[dataSize - 1], technicalIndicatorData }
    }
    const precision = technicalIndicator.precision
    const colors = technicalIndicatorStyleOptions.line.colors || []
    const colorSize = colors.length
    let lineCount = 0
    plots.forEach((plot: { key: string | number; type: any; color: (arg0: { preData: { kLineData: import("../data/Bar").default; technicalIndicatorData: any }; currentData: { kLineData: import("../data/Bar").default; technicalIndicatorData: any } }, arg1: any) => any }) => {
      const value = technicalIndicatorData[plot.key]
      let backgroundColor
      switch (plot.type) {
        case PlotType.CIRCLE: {
          backgroundColor = (plot.color && plot.color(cbData, technicalIndicatorStyleOptions)) || technicalIndicatorStyleOptions.circle.noChangeColor
          break
        }
        case PlotType.BAR: {
          backgroundColor = (plot.color && plot.color(cbData, technicalIndicatorStyleOptions)) || technicalIndicatorStyleOptions.bar.noChangeColor
          break
        }
        default: {
          backgroundColor = colors[lineCount % colorSize]
          lineCount++
        }
      }
      if (isValid(value)) {
        this._drawMarkLabel(
          yAxisOptions, value, precision,
          lastValueMarkStyleOptions.textSize, lastValueMarkStyleOptions.textWeight,
          lastValueMarkStyleOptions.textFamily, lastValueMarkStyleOptions.textColor, backgroundColor,
          lastValueMarkStyleOptions.textPaddingLeft, lastValueMarkStyleOptions.textPaddingTop,
          lastValueMarkStyleOptions.textPaddingRight, lastValueMarkStyleOptions.textPaddingBottom
        )
      }
    })
  }

  /**
   * 绘制最新价文字
   * @private
   */
  _drawLastPriceLabel(yAxisOptions: any) {
    if (!this._yAxis.isCandleStickYAxis()) {
      return
    }
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const lastPriceMark = priceMark.last
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.text.display || dataSize === 0) {
      return
    }
    const kLineData = dataList[dataSize - 1]
    const close = kLineData.close
    const open = kLineData.open
    let backgroundColor
    if (close > open) {
      backgroundColor = lastPriceMark.upColor
    } else if (close < open) {
      backgroundColor = lastPriceMark.downColor
    } else {
      backgroundColor = lastPriceMark.noChangeColor
    }
    const priceMarkText = lastPriceMark.text
    this._drawMarkLabel(
      yAxisOptions, close, this._chartData.pricePrecision(),
      priceMarkText.size, priceMarkText.weight, priceMarkText.family,
      priceMarkText.color, backgroundColor,
      priceMarkText.paddingLeft, priceMarkText.paddingTop,
      priceMarkText.paddingRight, priceMarkText.paddingBottom
    )
  }

  /**
   * 绘制标记label
   * @param yAxisOptions
   * @param value
   * @param precision
   * @param textSize
   * @param textWeight
   * @param textFamily
   * @param textColor
   * @param backgroundColor
   * @param textPaddingLeft
   * @param textPaddingTop
   * @param textPaddingRight
   * @param textPaddingBottom
   * @private
   */
  _drawMarkLabel(
    yAxisOptions: any, value: number, precision: number | undefined, textSize: number , textWeight: string | undefined, textFamily: string | undefined, textColor: string | CanvasGradient | CanvasPattern, backgroundColor: string | CanvasGradient | CanvasPattern,
    textPaddingLeft: number, textPaddingTop: number, textPaddingRight: any, textPaddingBottom: any
  ) {
    let valueY = this._yAxis.convertToPixel(value)
    valueY = +(Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98))).toFixed(0)
    let text
    if (this._yAxis.isPercentageYAxis()) {
      const fromClose = this._chartData.dataList()[this._chartData.from()].close
      text = `${((value - fromClose) / fromClose * 100).toFixed(2)}%`
    } else {
      text = formatPrecision(value, precision)
      if (this._additionalDataProvider.technicalIndicator().shouldFormatBigNumber) {
        text = formatBigNumber(text)
      }
    }
    this._ctx.font = getFont(textSize, textWeight, textFamily)
    const rectWidth = calcTextWidth(this._ctx, text) + textPaddingLeft + textPaddingRight
    const rectHeight = textPaddingTop + textSize + textPaddingBottom
    let rectStartX
    if (this._isDrawFromStart(yAxisOptions)) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }
    this._ctx.fillStyle = backgroundColor
    this._ctx.fillRect(rectStartX, valueY - textPaddingTop - textSize / 2, rectWidth, rectHeight)
    this._ctx.fillStyle = textColor
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, rectStartX + textPaddingLeft, valueY)
  }

  /**
   * 判断是否从开始点绘制
   * @private
   */
  _isDrawFromStart(yAxisOptions: { position: string; inside: any }) {
    return ((yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside) ||
      (yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside))
  }
}
