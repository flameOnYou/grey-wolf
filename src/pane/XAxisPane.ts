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


import XAxisWidget from '../widget/XAxisWidget'
import XAxis from '../component/XAxis'
import { Pane } from './Pane'

export default class XAxisPane extends Pane {

    _xAxis!:XAxis

  _createYAxisWidget(container: HTMLElement, props: any): import("../widget/YAxisWidget").default {
      throw new Error("Method not implemented.")
  }
  _initBefore () {
    this._xAxis = new XAxis(this._chartData)
  }

  _createMainWidget (container:HTMLElement, props:any) {
    return new XAxisWidget({ container, chartData: props.chartData, xAxis: this._xAxis })
  }

  computeAxis () {
    this._xAxis.computeAxis()
  }

  getSelfAxisHeight () {
    return this._xAxis.getSelfHeight()
  }

  xAxis () {
    return this._xAxis
  }

  setWidth (mainWidgetWidth:number, yAxisWidgetWidth:number) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._xAxis.setWidth(mainWidgetWidth)
  }

  setHeight (height:number) {
    super.setHeight(height)
    this._xAxis.setHeight(height)
  }
}
