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

import ChartPane, { CANDLE_STICK_PANE_TAG } from './pane/ChartPane'
import { isArray, clone } from './utils/typeChecks'
import { GraphicMarkType } from './data/ChartData'

export default class Chart {
  _chartPane:ChartPane
  id:any

  constructor (container:HTMLElement, styleOptions:any) {
    this._chartPane = new ChartPane(container, styleOptions)
  }

  /**
   * 设置样式配置
   * @param options
   */
  setStyleOptions (options:any) {
    if (options) {
      this._chartPane.chartData().applyStyleOptions(options)
      this._chartPane.resize()
    }
  }

  /**
   * 获取样式配置
   * @returns {[]|*[]}
   */
  getStyleOptions () {
    return clone(this._chartPane.chartData().styleOptions())
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  setTechnicalIndicatorParams (technicalIndicatorType:any, params:any) {
    if (technicalIndicatorType) {
      this._chartPane.applyTechnicalIndicatorParams(technicalIndicatorType, params)
    }
  }

  /**
   * 获取技术指标参数配置
   */
  getTechnicalIndicatorParamOptions () {
    return this._chartPane.chartData().technicalIndicatorCalcParams()
  }

  /**
   * 加载精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPrecision (pricePrecision:any, volumePrecision:any) {
    this._chartPane.chartData().applyPrecision(pricePrecision, volumePrecision)
  }

  /**
   * 设置技术指标精度
   * @param precision
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorPrecision (precision:number, technicalIndicatorType:any) {
    this._chartPane.chartData().applyTechnicalIndicatorPrecision(precision, technicalIndicatorType)
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone:any) {
    this._chartPane.setTimezone(timezone)
  }

  /**
   * 重置尺寸，总是会填充父容器
   */
  resize () {
    this._chartPane.resize()
  }

  /**
   * 设置右边间距
   * @param space
   */
  setOffsetRightSpace (space:any) {
    this._chartPane.chartData().setOffsetRightSpace(space)
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount:any) {
    this._chartPane.chartData().setLeftMinVisibleBarCount(barCount)
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount:any) {
    this._chartPane.chartData().setRightMinVisibleBarCount(barCount)
  }

  /**
   * 设置一条数据的空间
   * @param space
   */
  setDataSpace (space:any) {
    this._chartPane.chartData().setDataSpace(space)
  }

  /**
   * 清空数据
   */
  clearData () {
    this._chartPane.chartData().clearDataList()
  }

  /**
   * 获取数据源
   */
  getDataList () {
    return this._chartPane.chartData().dataList()
  }

  /**
   * 添加新数据
   * @param dataList
   * @param more
   */
  applyNewData (dataList:any, more:any) {
    this._chartPane.applyNewData(dataList, more)
  }

  /**
   * 添加历史更多数据
   * @param dataList
   * @param more
   */
  applyMoreData (dataList:any, more:any) {
    this._chartPane.applyMoreData(dataList, more)
  }

  /**
   * 更新数据
   * @param data
   */
  updateData (data:any) {
    this._chartPane.updateData(data)
  }

  /**
   * 设置加载更多回调
   * @param cb
   */
  loadMore (cb:any) {
    this._chartPane.chartData().loadMore(cb)
  }

  /**
   * 设置蜡烛图表类型
   * @param type
   */
  setCandleStickChartType (type:any) {
    this._chartPane.setCandleStickChartType(type)
  }

  /**
   * 设置蜡烛图技术指标类型
   * @param technicalIndicatorType
   */
  setCandleStickTechnicalIndicatorType (technicalIndicatorType:any) {
    if (technicalIndicatorType) {
      this._chartPane.setTechnicalIndicatorType(CANDLE_STICK_PANE_TAG, technicalIndicatorType)
    }
  }

  /**
   * 设置技术指标类型
   * @param tag
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (tag:any, technicalIndicatorType:any) {
    if (tag) {
      this._chartPane.setTechnicalIndicatorType(tag, technicalIndicatorType)
    }
  }

  /**
   * 创建一个技术指标
   * @param technicalIndicatorType
   * @param height
   * @param dragEnabled
   * @returns {string}
   */
  createTechnicalIndicator (technicalIndicatorType:any, height:any, dragEnabled:any) {
    return this._chartPane.createTechnicalIndicator(technicalIndicatorType, height, dragEnabled)
  }

  /**
   * 添加自定义技术指标
   * @param technicalIndicatorInfo
   */
  addCustomTechnicalIndicator (technicalIndicatorInfo:any) {
    this._chartPane.chartData().addCustomTechnicalIndicator(technicalIndicatorInfo)
  }

  /**
   * 移除一个技术指标
   * @param tag
   */
  removeTechnicalIndicator (tag:any) {
    if (tag) {
      this._chartPane.removeTechnicalIndicator(tag)
    }
  }

  /**
   * 添加图形标记
   * @param type
   */
  addGraphicMark (type:any) {
    const graphicMarkType = this._chartPane.chartData().graphicMarkType()
    if (graphicMarkType !== type) {
      const graphicMarkDatas = this._chartPane.chartData().graphicMarkData()
      const graphicMarkData = graphicMarkDatas[graphicMarkType]
      if (graphicMarkData && isArray(graphicMarkData)) {
        graphicMarkData.splice(graphicMarkData.length - 1, 1)
        graphicMarkDatas[graphicMarkType] = graphicMarkData
      }
      if (!graphicMarkDatas.hasOwnProperty(type)) {
        type = GraphicMarkType.NONE
      }
      this._chartPane.chartData().setGraphicMarkType(type)
      this._chartPane.chartData().setGraphicMarkData(graphicMarkDatas)
    }
  }

  /**
   * 移除所有标记图形
   */
  removeAllGraphicMark () {
    const graphicMarkDatas = this._chartPane.chartData().graphicMarkData()
    const newGraphicMarkDatas:any = {}
    Object.keys(graphicMarkDatas).forEach(key => {
      newGraphicMarkDatas[key] = []
    })
    this._chartPane.chartData().setGraphicMarkType(GraphicMarkType.NONE)
    this._chartPane.chartData().setGraphicMarkData(newGraphicMarkDatas)
  }

  /**
   * 获取将图表装换成图片后的url
   * @param includeFloatLayer
   * @param includeGraphicMark
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeFloatLayer:any, includeGraphicMark:any, type:any, backgroundColor:any) {
    return this._chartPane.getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
  }

  /**
   * 销毁
   */
  destroy () {
    this._chartPane.destroy()
    // delete this
  }
}
