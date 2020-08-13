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

import TechnicalIndicator, { TechnicalIndicatorSeries } from './TechnicalIndicator'

import MovingAverage from './directionalmovement/MovingAverage'


import { isArray, isFunction, isNumber, isValid } from '../../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../../utils/format'
import { DEV } from '../../utils/env'

/**
 * 创建技术指标集合
 */
export function createTechnicalIndicators () {
  return {
    ['MA']: {
      structure: MovingAverage,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      calcParams: [5, 10, 30, 60]
    }
  }
}

import Bar from '../Bar'
interface  calcTechnicalIndicatorFunc {dataList:Array<Bar>, calcParams:Array<any>}

/**
 * 创建一个新的技术指标
 * @param name
 * @param series
 * @param calcParams
 * @param plots
 * @param precision
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param baseValue
 * @param minValue
 * @param maxValue
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @returns
 */
export function createNewTechnicalIndicator(
  name:string,
  series:TechnicalIndicatorSeries,
  calcParams:Array<any>,
  plots:Array<any>,
  precision:number,
  shouldCheckParamCount:Boolean,
  shouldOhlc:Boolean,
  shouldFormatBigNumber:Boolean,
  baseValue:number,
  minValue:number,
  maxValue:number,
  calcTechnicalIndicator:any,
  regeneratePlots:any
): TechnicalIndicator| null{
  if (!name || !isFunction(calcTechnicalIndicator)) {
    if (DEV) {
      console.warn(
        'The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!'
      )
    }
    return null
  }
  class NewTechnicalIndicator extends TechnicalIndicator {
    constructor () {
      super(
        
          name,
          series,
          calcParams,
          plots,
          precision,
          shouldCheckParamCount,
          shouldOhlc,
          shouldFormatBigNumber,
          baseValue,
          minValue,
          maxValue
        
      )
    }
  }

  const newTechnicalIndicator = new NewTechnicalIndicator();

  NewTechnicalIndicator.prototype.calcTechnicalIndicator = calcTechnicalIndicator
  
  if (regeneratePlots) {
    NewTechnicalIndicator.prototype.regeneratePlots = regeneratePlots
  }
  return newTechnicalIndicator
}

/**
 * 获取技术指标信息
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @param yAxis
 * @returns {{values: [], name: string, labels: []}}
 */
export function getTechnicalIndicatorInfo (technicalIndicatorData:{[key:string]:any}, technicalIndicator: { calcParams: any; plots: any; precision: any; shouldFormatBigNumber: any; name: string }, yAxis: { convertToPixel: (arg0: any) => any }) {
  const calcParams = technicalIndicator.calcParams
  const plots = technicalIndicator.plots
  const precision = technicalIndicator.precision
  const shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber

  let labels:any []= new Array
  let values:any []= new Array
  
  let name = ''
  if (plots.length > 0) {
    name = technicalIndicator.name
  }
  if (calcParams.length > 0) {
    name = `${name}(${calcParams.join(',')})`
  }
  plots.forEach((plot: { key: string }) => {
    labels.push(plot.key.toUpperCase())
    let value = technicalIndicatorData[plot.key]
    let y
    if (isValid(value)) {
      y = yAxis.convertToPixel(value)
      value = formatPrecision(value, precision)
      if (shouldFormatBigNumber) {
        value = formatBigNumber(value)
      }
    }
    values.push({ value, y })
  })
  return { labels, values, name }
}
