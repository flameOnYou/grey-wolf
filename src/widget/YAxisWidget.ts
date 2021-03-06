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

import Widget from './Widget'
import YAxisView from '../view/YAxisView'
import YAxisFloatLayerView from '../view/YAxisFloatLayerView'

export default class YAxisWidget extends Widget {
  // _createExpandView(container: HTMLElement, props: any): import("../view/View").View {
  //     throw new Error("Method not implemented.")
  // }
  _createMainView (container:HTMLElement, props:any) {
    return new YAxisView(container, props.chartData, props.yAxis, props.additionalDataProvider)
  }

  _createFloatLayerView (container:HTMLElement, props:any) {
    return new YAxisFloatLayerView(container, props.chartData, props.yAxis, props.additionalDataProvider)
  }
}
