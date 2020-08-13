import CandleStickView from '../view/CandleStickView'
import CandleStickFloatLayerView from '../view/CandleStickFloatLayerView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'
import GraphicMarkView from '../view/GraphicMarkView'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView (container:HTMLElement, props:any) {
    return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createExpandView  (container:HTMLElement, props:any) {
    return new GraphicMarkView(container, props.chartData, props.xAxis, props.yAxis)
  }

  _createFloatLayerView  (container:HTMLElement, props:any) {
    return new CandleStickFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}