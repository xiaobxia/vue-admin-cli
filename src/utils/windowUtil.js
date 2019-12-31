export default {
  // 全屏
  fullPage() {
    /* 判断是否全屏*/
    let isFullscreen = document.fullScreenElement ||// W3C
      document.msFullscreenElement || // IE
      document.mozFullScreenElement || // 火狐
      document.webkitFullscreenElement || // 谷歌
      false
    if (!isFullscreen) {
      var el = document.documentElement
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      }
      return true
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
      return false
    }
  }
}
