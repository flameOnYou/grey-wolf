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

/**
 * 获取屏幕比
 *  
 * @param ctx
 * @returns {number}
 */
export function getPixelRatio (ctx:any) {
  const backingStore = ctx.ownerDocument ||
    ctx.ownerDocument.defaultView ||
    ctx.ownerDocument.devicePixelRatio  || 1
  return (window.devicePixelRatio || 1) / backingStore
}

/**
 * 测量文字的宽度
 * @param ctx
 * @param text
 * @returns {number}
 */
export function calcTextWidth (ctx:CanvasRenderingContext2D, text:string) {
  return Math.round(ctx.measureText(text).width)
}

/**
 * 获取字体
 * @param fontSize
 * @param fontFamily
 * @param fontWeight
 * @returns {string}
 */
export function getFont (fontSize = 12, fontWeight = 'normal', fontFamily = 'Helvetica Neue') {
  return `${fontWeight} ${fontSize}px ${fontFamily}`
}

/**
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */
export function drawHorizontalLine (ctx:CanvasRenderingContext2D, y:number, left:number, right:number) {
  ctx.beginPath()
  const correction = (ctx.lineWidth % 2) ? 0.5 : 0
  ctx.moveTo(left, y + correction)
  ctx.lineTo(right, y + correction)
  ctx.stroke()
  ctx.closePath()
}

/**
 * 绘制垂直直线
 * @param ctx
 * @param x
 * @param top
 * @param bottom
 */
export function drawVerticalLine (ctx:CanvasRenderingContext2D, x:number, top:number, bottom:number) {
  ctx.beginPath()
  const correction = (ctx.lineWidth % 2) ? 0.5 : 0
  ctx.moveTo(x + correction, top)
  ctx.lineTo(x + correction, bottom)
  ctx.stroke()
  ctx.closePath()
}

/**
 * 绘制线
 * @param ctx
 * @param drawFuc
 */
export function drawLine (ctx:CanvasRenderingContext2D, drawFuc:any) {
  ctx.save()
  if (ctx.lineWidth % 2) {
    ctx.translate(0.5, 0.5)
  }
  drawFuc()
  ctx.restore()
}
