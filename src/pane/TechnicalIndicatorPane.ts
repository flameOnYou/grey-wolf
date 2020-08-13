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

import {Pane} from './Pane'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
// import { MACD } from '../data/technicalindicator/defaultTechnicalIndicatorType'
import YAxis from '../component/YAxis'
import TechnicalIndicator from '../data/technicalindicator/TechnicalIndicator'

export default class TechnicalIndicatorPane extends Pane {
    _tag!:string
    _yAxis!:YAxis
    _technicalIndicator!:TechnicalIndicator

  constructor (props:any) {
    super(props)
    const technicalIndicatorType = props.technicalIndicatorType
    this.setTechnicalIndicatorType(technicalIndicatorType)
  }

  _initBefore (props:any) {
    this._tag = props.tag
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props:any) {
    return new YAxis(
      props.chartData,
      false,
      { technicalIndicator: this.technicalIndicator.bind(this), isTimeLine: this._isRealTime.bind(this) })
  }

  _createMainWidget (container:HTMLElement, props:any) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicator: this.technicalIndicator.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _createYAxisWidget (container:HTMLElement, props:any) {
    return new YAxisWidget({
      container,
      chartData: props.chartData,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicator: this.technicalIndicator.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _isRealTime () {
    return false
  }

  setHeight (height:number) {
    super.setHeight(height)
    this._yAxis.setHeight(height)
  }

  setWidth (mainWidgetWidth:number, yAxisWidgetWidth:number) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._yAxis.setWidth(yAxisWidgetWidth)
  }

  computeAxis () {
    this._yAxis.calcMinMaxValue()
    this._yAxis.computeAxis()
  }

  getSelfAxisWidth () {
    // return this._yAxis.getSelfWidth(this._technicalIndicator)
    return this._yAxis.getSelfWidth()
  }

  /**
   * 获取标识
   * @returns {string}
   */
  tag () {
    return this._tag
  }

  yAxis () {
    return this._yAxis
  }

  /**
   * 获取技术指标
   * @returns {string}
   */
  technicalIndicator () {
    return this._technicalIndicator
  }

  /**
   * 设置技术指标类型
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (technicalIndicatorType:string) {
    const { structure: TechnicalIndicator } = this._chartData.technicalIndicator(technicalIndicatorType)
    if (
      (!this._technicalIndicator && !TechnicalIndicator) ||
      (this._technicalIndicator && this._technicalIndicator.name === technicalIndicatorType)
    ) {
      return
    }
    if (TechnicalIndicator) {
      this._technicalIndicator = new TechnicalIndicator()
    } 

    this._chartData.calcTechnicalIndicator(this)
  }
}
