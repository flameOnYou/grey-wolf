import Widget from './Widget'
import XAxisView from '../view/XAxisView'
import XAxisFloatLayerView from '../view/XAxisFloatLayerView'

export default class XAxisWidget extends Widget {

  // _createExpandView(container: HTMLElement, props: any): import("../view/View").View {
  //     // throw new Error("Method not implemented.")
  // }
  _createMainView (container:HTMLElement, props:any) {
    return new XAxisView(container, props.chartData, props.xAxis)
  }

  _createFloatLayerView (container:HTMLElement, props:any) {
    return new XAxisFloatLayerView(container, props.chartData, props.xAxis)
  }
}
