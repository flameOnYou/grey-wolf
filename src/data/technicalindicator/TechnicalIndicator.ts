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

import { clone, isArray, isBoolean, isNumber, isValid } from '../../utils/typeChecks'
import Bar from '../Bar'
/**
 * 技术指标系列
 * @type {{PRICE: string, VOLUME: string, NORMAL: string}}
 */
export enum TechnicalIndicatorSeries{
  PRICE= 'price',
  VOLUME= 'volume',
  NORMAL= 'normal'
}

export default class TechnicalIndicator {

    result:any

  constructor (
    public name:string, 
    public series:TechnicalIndicatorSeries, 
    public calcParams:Array<any>, 
    public plots:Array<any>,
    public precision?:number, 
    public shouldCheckParamCount?:Boolean,
    public shouldOhlc?:Boolean, 
    public shouldFormatBigNumber?:Boolean,
    public baseValue?:number, 
    public minValue?:number, 
    public maxValue?:number
  ) {
    // 指标名
    this.name = name || ''
    // 指标系列，值有'price', 'volume', 'normal
    this.series = series || 'normal'
    // 精度
    this.precision = precision != null && isValid(precision) && 
        isNumber(precision)  && precision >= 0 ? precision : 4
    // 计算参数
    this.calcParams = isArray(calcParams) ? calcParams : new Array
    // 数据信息
    this.plots = isArray(plots) ? plots : []
    // 是否需要检查参数
    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true
    // 是否需要ohlc
    this.shouldOhlc = shouldOhlc
    // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
    this.shouldFormatBigNumber = shouldFormatBigNumber
    // 基础比对数据
    this.baseValue = baseValue
    // 指定的最小值
    this.minValue = minValue
    // 指定的最大值
    this.maxValue = maxValue
    // 指标计算结果
    this.result = []
    //几何图形库
    // this.geometrys = []
  }

  setPrecision (precision: string) {
    this.precision = parseInt(precision, 10)
  }

  setCalcParams (params = []) {
    if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
      return
    }
    this.calcParams = clone(params)
    const plots = this.regeneratePlots(params)
    if (plots) {
      this.plots = plots
    }
  }

  /**
   * 计算技术指标
   */
  calcTechnicalIndicator (dataList:Array<Bar>, calcParams:Array<any>) {}


  /**
   * 重新生成各项数据
   * @private
   */
  regeneratePlots (params:any[]):any[]{return []}
}
