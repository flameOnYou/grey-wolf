/**
 * 获取版本号
 * @returns {string}
 */
function version () {
    return '__BUILD_VERSION__'
  }

import { getPixelRatio } from "./utils/canvas";
function test(){
    getPixelRatio(document.createElement('canvas'))
}