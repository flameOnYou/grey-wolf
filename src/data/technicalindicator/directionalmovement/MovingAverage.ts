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

export default class MovingAverage extends TechnicalIndicator {
  constructor () {
    const name = 'MA'
    const series = TechnicalIndicatorSeries.PRICE
    const calcParams = [5, 10, 30, 60]
    const precision = 2
    const shouldCheckParamCount = false
    const shouldOhlc = true
    const plots = [
      { key: 'ma5', type: 'line' },
      { key: 'ma10', type: 'line' },
      { key: 'ma30', type: 'line' },
      { key: 'ma60', type: 'line' }
    ]

    super(name,series,calcParams,plots,precision,shouldCheckParamCount,shouldOhlc)
  }

  regeneratePlots (params:any[]) {
    // const plots = anny
    let plots:any [] = new Array
    params.forEach(p => {
      plots.push({ key: `ma${p}`, type: 'line' })
    })
    return plots
  }

  calcTechnicalIndicator (dataList:Array<Bar>, calcParams:Array<any>) {
    let closeSums :any [] = new Array
    let result :any [] = new Array
    
    dataList.forEach((kLineData, i) => {
      const ma :{[key:string]:number} = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          const p = this.plots[j]
          const key:string = p['key']
          ma[key] = closeSums[j] / param
          closeSums[j] -= dataList[i - (param - 1)].close
        }
      })
      result.push(ma)
    })
    return result
  }
}
