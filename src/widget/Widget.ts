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

import { InvalidateLevel } from '../data/ChartData'
import { getPixelRatio } from '../utils/canvas'
import { View } from '../view/View'

export default abstract class Widget {
    _width = 0
    _height = 0
    _element: HTMLElement
    _mainView:View
    _expandView:View
    _floatLayerView:View

  constructor (props:any) {

    this._initElement(props.container)
    this._element = document.createElement('div')
    this._mainView = this._createMainView(this._element, props)
    this._expandView = this._createExpandView(this._element, props)
    this._floatLayerView = this._createFloatLayerView(this._element, props)
  }

  /**
   * 初始化element
   * @param container
   * @private
   */
  _initElement (container:HTMLElement) {
    this._element.style.top = '0'
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.position = 'absolute'
    this._element.style.overflow = 'hidden'
    container.appendChild(this._element)
  }

  /**
   * 创建主view
   * @param container
   * @param props
   * @private
   */
  abstract _createMainView (container:HTMLElement, props:any):View;

  /**
   * 创建拓展的view
   * @param container
   * @param props
   * @private
   */
  abstract _createExpandView (container:HTMLElement, props:any):View;

  /**
   * 创建浮层view
   * @param container
   * @param props
   * @private
   */
  abstract _createFloatLayerView  (container:HTMLElement, props:any):View;

  getElement () {
    return this._element
  }

  setWidth (width:number) {
    this._width = width
    this._mainView.setWidth(width)
    this._floatLayerView.setWidth(width)
    this._expandView && this._expandView.setWidth(width)
  }

  setHeight (height:number) {
    this._height = height
    this._mainView.setHeight(height)
    this._floatLayerView.setHeight(height)
    this._expandView && this._expandView.setHeight(height)
  }

  setOffsetLeft (offsetLeft:number) {
    this._element.style.left = `${offsetLeft}px`
  }

  layout () {
    if (this._element.offsetWidth !== this._width) {
      this._element.style.width = `${this._width}px`
    }
    if (this._element.offsetHeight !== this._height) {
      this._element.style.height = `${this._height}px`
    }
    this._mainView.layout()
    this._floatLayerView.layout()
    this._expandView && this._expandView.layout()
  }

  /**
   * 更新
   * @param level
   */
  invalidate (level:number) {
    switch (level) {
      case InvalidateLevel.GRAPHIC_MARK: {
        this._expandView && this._expandView.flush()
        break
      }
      case InvalidateLevel.FLOAT_LAYER: {
        this._floatLayerView.flush()
        break
      }
      case InvalidateLevel.MAIN:
      case InvalidateLevel.FULL: {
        this._mainView.flush()
        this._floatLayerView.flush()
        this._expandView && this._expandView.flush()
        break
      }
      default: {
        break
      }
    }
  }

   

  /**
   * 将widget转换成图片
   * @param includeFloatLayer
   * @param includeGraphicMark
   * @returns {HTMLCanvasElement}
   */
  getImage (includeFloatLayer:any, includeGraphicMark:any):HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
    const pixelRatio = getPixelRatio(ctx)
    canvas.style.width = `${this._width}px`
    canvas.style.height = `${this._height}px`
    canvas.width = this._width * pixelRatio
    canvas.height = this._height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.drawImage(this._mainView.getImage(), 0, 0, this._width, this._height)

    if (includeGraphicMark && this._expandView) {
      ctx.drawImage(this._expandView.getImage(), 0, 0, this._width, this._height)
    }
    if (includeFloatLayer) {
      ctx.drawImage(this._floatLayerView.getImage(), 0, 0, this._width, this._height)
    }
    return canvas
  }
}
