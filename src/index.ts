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

let message: string = 'Hello World';
console.log(message);

import Chart from "./Chart"
import { DEV } from './utils/env'

const instances:any = {}
let chartBaseId = 1
const CHART_NAME_PREFIX = 'k_line_chart_'

/**
 * 获取版本号
 * @returns {string}
 */
function version (): string {
  return '__BUILD_VERSION__'
}

/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */
function init (ds:any, style = {}) :Chart{
  const errorMessage = 'Chart version is __BUILD_VERSION__. Root dom is null, can not initialize the chart!!!'
  let container = ds
  if (!container) {
    throw new Error(errorMessage)
  }
  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds)
  }
  if (!container) {
    throw new Error(errorMessage)
  }
  const instance = instances[container.chartId || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const id = `${CHART_NAME_PREFIX}${chartBaseId++}`
  const chart = new Chart(container, style)
  chart.id = id
  container.chartId = id
  instances[id] = chart
  return chart
}

/**
 * 销毁
 * @param dcs
 */
function dispose (dcs:any) {
  if (dcs) {
    let id
    if (typeof dcs === 'string') {
      dcs = document.getElementById(dcs) || document.getElementsByClassName(dcs)
      id = dcs.chartId
    }
    if (!id) {
      id = dcs.chartId
    }
    if (!id && dcs instanceof Chart) {
      id = dcs.id
    }
    if (id) {
      instances[id].destroy()
      delete instances[id]
    }
  }
}

function getSimulationData (baseTimestamp = Date.now(), basePrice = 5000, dataSize = 800) {
  const dataList = []
  let timestamp = Math.floor(baseTimestamp / 60 / 1000) * 60 * 1000
  let baseValue = basePrice
  const prices = []
  for (let i = 0; i < dataSize; i++) {
    baseValue = baseValue + Math.random() * 20 - 10
    for (let j = 0; j < 4; j++) {
      prices[j] = (Math.random() - 0.5) * 12 + baseValue
    }
    prices.sort()
    const openIdx = +Math.round(Math.random() * 3).toFixed(0)
    let closeIdx = +Math.round(Math.random() * 2).toFixed(0)
    if (closeIdx === openIdx) {
      closeIdx++
    }
    const volume = Math.random() * 50 + 10
    timestamp -= 60 * 1000
    const kLineModel:any = {
      open: prices[openIdx],
      low: prices[0],
      high: prices[3],
      close: prices[closeIdx],
      volume: volume,
      timestamp
    }
    kLineModel.turnover = (kLineModel.open + kLineModel.close + kLineModel.high + kLineModel.low) / 4 * volume
    dataList.unshift(kLineModel)
  }
  return dataList
}


// export { version, init, dispose }
const chart = init('stock_chart')
const data:any = getSimulationData()
console.log("生成数据",data)
chart.applyNewData(data,false)
