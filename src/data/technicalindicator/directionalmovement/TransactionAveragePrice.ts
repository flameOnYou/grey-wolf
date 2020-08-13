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


import TechnicalIndicator, { TechnicalIndicatorSeries } from '../TechnicalIndicator'
import Bar from '../../Bar'

export default class TransactionAveragePrice extends TechnicalIndicator {
  constructor () {
    const name = 'TAP'
    const series = TechnicalIndicatorSeries.PRICE
    const calcParams = [5, 10, 30, 60]
    const precision = 2
    const shouldCheckParamCount = false
    const shouldOhlc = true
    const plots = [
        { key: 'average', type: 'line' }
    ]

    super(name,series,calcParams,plots,precision,shouldCheckParamCount,shouldOhlc)
  }

  

  calcTechnicalIndicator (dataList:Array<Bar>, calcParams:Array<any>) {
    let turnoverSum = 0
    let volumeSum = 0
    const result :any [] = new Array()
    dataList.forEach(kLineData => {
      const average:any = {}
      const turnover = kLineData.turnover || 0
      const volume = kLineData.volume || 0
      turnoverSum += turnover
      volumeSum += volume
      if (volume !== 0) {
        average.average = turnoverSum / volumeSum
      }
      result.push(average)
    })
    return result
  }
}
