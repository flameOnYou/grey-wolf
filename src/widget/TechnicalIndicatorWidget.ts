import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorFloatLayerView from '../view/TechnicalIndicatorFloatLayerView'

export default class TechnicalIndicatorWidget extends Widget {

  // _createExpandView(container: HTMLElement, props: any): import("../view/View").View {
  //     throw new Error("Method not implemented.")
  // }
  _createMainView (container:HTMLElement, props:any) {
    return new TechnicalIndicatorView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createFloatLayerView (container:HTMLElement, props:any) {
    return new TechnicalIndicatorFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}
