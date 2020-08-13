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

import EventHandler, { isMouse, isTouch } from './EventHandler'
import ChartData from '../data/ChartData'
import { Point } from '../utils/shape'

export default class ZoomScrollEventHandler extends EventHandler {
      // 开始滚动时坐标点
      _startScrollPoint:any = {}
      // 开始触摸时坐标
      _touchPoint:any = {}
      // 是否是取消了十字光标
      _touchCancelCrossHair = false
      // 是否缩放过
      _touchZoomed = false
      // 用来记录捏合缩放的尺寸
      _pinchScale = 1


  constructor (chartData:ChartData) {
    super(chartData)

  }

  pinchStartEvent () {
    this._pinchScale = 1
    this._touchZoomed = true
  }

  pinchEvent (middlePoint:Point, scale:number) {
    const zoomScale = (scale - this._pinchScale) * 5
    this._pinchScale = scale
    this._chartData.zoom(zoomScale, middlePoint)
  }

  mouseLeaveEvent (event:any) {
    if (isMouse(event)) {
      this._chartData.setCrossHairPointPaneTag(null, null)
    }
  }

  mouseMoveEvent (event:any) {
    if (!isMouse(event)) {
      return
    }
    this._performCross(event, false, (cross: any) => {
      const p = new Point(event.localX,cross.y)
      this._chartData.setCrossHairPointPaneTag(p, cross.tag)
    }, () => {
      this._chartData.setCrossHairPointPaneTag(null, null)
    })


  }

  mouseWheelEvent (event: { localX: number; deltaY: number; cancelable: any; preventDefault: () => void; deltaMode: any; DOM_DELTA_PAGE: any; DOM_DELTA_LINE: any; localY: any }) {
    if (!this._checkEventPointX(event.localX)) {
      return
    }
    let deltaY = -(event.deltaY / 100)
    if (deltaY === 0) {
      return
    }
    if (event.cancelable) {
      event.preventDefault()
    }

    switch (event.deltaMode) {
      case event.DOM_DELTA_PAGE:
        deltaY *= 120
        break

      case event.DOM_DELTA_LINE:
        deltaY *= 32
        break
    }

    if (deltaY !== 0) {
      const scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY))
      // this._chartData.zoom(scale, { x: event.localX, y: event.localY })
      this._chartData.zoom(scale, new Point(event.localX,event.localY ))
    }
  }

  mouseClickEvent (event: { localX: any; localY: any }) {
    this._performCross(event, true, (cross: any) => {
      if (!this._touchPoint && !this._touchCancelCrossHair && !this._touchZoomed) {
        this._touchPoint = { x: event.localX, y: event.localY }
        // this._chartData.setCrossHairPointPaneTag({ x: event.localX, y: cross.y }, cross.tag)
        this._chartData.setCrossHairPointPaneTag( new Point(event.localX, cross.y), cross.tag)
       
      }
    },null)
  }

  mouseDownEvent (event: { localX: number; localY: number }) {
    this._startScrollPoint = { x: event.localX, y: event.localY }
    this._chartData.startScroll()
    this._performCross(event, true, (cross:any) => {
      // const crossHairPoint = { x: event.localX, y: cross.y }
      const crossHairPoint = new Point(event.localX, cross.y)
      this._touchZoomed = false
      if (this._touchPoint) {
        const xDif = event.localX - this._touchPoint.x
        const yDif = event.localY - this._touchPoint.y
        const radius = Math.sqrt(xDif * xDif + yDif * yDif)
        if (radius < 10) {
          this._touchPoint = { x: event.localX, y: event.localY }
          this._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag)
        } else {
          this._touchCancelCrossHair = true
          this._touchPoint = null
          this._chartData.setCrossHairPointPaneTag(null, null)
        }
      } else {
        this._touchCancelCrossHair = false
      }
    },null)
  }

  pressedMouseMoveEvent (event: { localX: number; localY: any }) {
    this._performCross(event, false, (cross: { y: any; tag: any }) => {
      // const crossHairPoint = { x: event.localX, y: cross.y }
      const crossHairPoint = new Point(event.localX, cross.y)
      
      if (isTouch(event)) {
        if (this._touchPoint) {
          this._touchPoint = { x: event.localX, y: event.localY }
          this._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag)
          return
        }
      }
      const distance = event.localX - this._startScrollPoint.x
      this._chartData.setCrossHairPointPaneTag(crossHairPoint, cross.tag)
      this._chartData.scroll(distance)
    },null)
  }

  longTapEvent (event:any) {
    this._performCross(event, true, (cross:any) => {
      this._touchPoint = { x: event.localX, y: event.localY }
      // this._chartData.setCrossHairPointPaneTag({ x: event.localX, y: cross.y }, cross.tag)
      this._chartData.setCrossHairPointPaneTag(new Point(event.localX, cross.y), cross.tag)
    },null)

 

  
}

 /**
   * 处理十字光标
   * @param event
   * @param checkTouchEvent
   * @param performFuc
   * @param extendFun
   * @private
   */
  _performCross (event:any, checkTouchEvent:any, performFuc:any, extendFun:any) {
    if (checkTouchEvent && !isTouch(event)) {
      return
    }
    if (!this._checkEventPointX(event.localX)) {
      if (extendFun) {
        extendFun()
      }
      return
    }
    let isPerform = false
    for (const tag in this._paneContentSize) {
      const size = this._paneContentSize[tag]
      if (event.localY > size.contentTop && event.localY < size.contentBottom) {
        isPerform = true
        if (performFuc) {
          performFuc({ tag, y: event.localY - size.contentTop })
        }
        break
      }
    }
    if (!isPerform && extendFun) {
      extendFun()
    }
  }
}