<template>
  <div class="g-p-wrap">
    <object id="view1" type="application/x-eloamplugin" width="600" height="400" name="view"/>
    <object id="thumb1" style="display: none" type="application/x-eloamplugin" width="1208" height="150" name="thumb"/>
    <select id="device" style="display: none" name="device"/>
    <select id="subType" style="display: none" name="subType"/>
    <select id="selRes" style="display: none" name="selRes"/>
  </div>
</template>

<script>

function plugin() {
  return document.getElementById('view1')
}

function view() {
  return document.getElementById('view1')
}

function thumb() {
  return document.getElementById('thumb1')
}

function addEvent(obj, name, func) {
  if (obj.attachEvent) {
    obj.attachEvent('on' + name, func)
  } else {
    obj.addEventListener(name, func, false)
  }
}

export default {
  name: 'GPPage',
  data() {
    return {
      DeviceMain: null, // 主头
      DeviceAssist: null, // 副头
      Video: null // 主头
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.Unload()
    setTimeout(() => {
      this.Load()
    }, 1000)
  },
  beforeDestroy() {
    this.Unload()
  },
  destroyed() {
    this.Unload()
  },
  methods: {
    Load() {
      // 设备接入和丢失
      // type设备类型， 1 表示视频设备， 2 表示音频设备
      // idx设备索引
      // dbt 1 表示设备到达， 2 表示设备丢失
      addEvent(plugin(), 'DevChange', (type, idx, dbt) => {
        console.log(type, '设备类型')
        console.log(dbt, '设备到达丢失')
        let sDevice = null
        // 视频设备
        if (type === 1) {
          // 设备到达
          if (dbt === 1) {
            var deviceType = plugin().Global_GetEloamType(1, idx)
            // 主摄像头
            if (deviceType === 1) {
              if (this.DeviceMain == null) {
                this.DeviceMain = plugin().Global_CreateDevice(1, idx)
                console.log(this.DeviceMain)
                if (this.DeviceMain) {
                  // var sSubType = document.getElementById('subType')
                  // var sResolution = document.getElementById('selRes')
                  // var lDeviceName = document.getElementById('lab1')
                  sDevice = document.getElementById('device')
                  sDevice.add(new Option(plugin().Device_GetFriendlyName(this.DeviceMain)))
                  sDevice.selectedIndex = idx// 选中主头
                  this.changeDev()
                  this.OpenVideo()// 是主头自动打开视频
                }
              }
            } else if (deviceType === 2 || deviceType === 3) {
              // 辅摄像头
              if (this.DeviceAssist == null) {
                this.DeviceAssist = plugin().Global_CreateDevice(1, idx)
                if (this.DeviceAssist) {
                  // var sSubType = document.getElementById('subType')
                  // var sResolution = document.getElementById('selRes')
                  // var lDeviceName = document.getElementById('lab1')
                  sDevice = document.getElementById('device')
                  sDevice.add(new Option(plugin().Device_GetFriendlyName(this.DeviceAssist)))
                }
              }
            }
          } else if (dbt === 2) {
            // 设备丢失
            if (this.DeviceMain) {
              if (plugin().Device_GetIndex(this.DeviceMain) === idx) {
                this.CloseVideo()
                plugin().Device_Release(this.DeviceMain)
                this.DeviceMain = null
                document.getElementById('device').options.length = 0
                document.getElementById('subType').options.length = 0
                document.getElementById('selRes').options.length = 0
              }
            }
            if (this.DeviceAssist) {
              if (plugin().Device_GetIndex(this.DeviceAssist) === idx) {
                this.CloseVideo()
                plugin().Device_Release(this.DeviceAssist)
                this.DeviceAssist = null
                document.getElementById('device').options.length = 0
                document.getElementById('subType').options.length = 0
                document.getElementById('selRes').options.length = 0
              }
            }
          }
        }
      })
      view().Global_SetWindowName('view')
      thumb().Global_SetWindowName('thumb')
      plugin().Global_InitDevs()
    },
    Unload() {
      console.log('卸载')
      console.log(this.Video)
      console.log(this.DeviceMain)
      console.log(this.DeviceAssist)
      if (this.Video) {
        view().View_SetText('', 0)
        plugin().Video_Release(this.Video)
        this.Video = null
      }
      if (this.DeviceMain) {
        plugin().Device_Release(this.DeviceMain)
        this.DeviceMain = null
      }
      if (this.DeviceAssist) {
        plugin().Device_Release(this.DeviceAssist)
        this.DeviceAssist = null
      }
      plugin().Global_DeinitDevs()
    },
    OpenVideo() {
      var sSubType = document.getElementById('subType')
      var sResolution = document.getElementById('selRes')
      // var lDeviceName = document.getElementById('lab1')
      var sDevice = document.getElementById('device')
      var dev = null
      if (sDevice.selectedIndex !== -1) {
        this.CloseVideo()
        if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceMain)) {
          dev = this.DeviceMain// 选中主头
        } else if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceAssist)) {
          dev = this.DeviceAssist// 选中副头
        }
        var SubtypeName = ''
        var SelectType = ''
        if (sSubType.options.selectedIndex !== -1) {
          SubtypeName = sSubType.options[sSubType.options.selectedIndex].text
          if (SubtypeName === 'YUY2') {
            SelectType = 1
          } else if (SubtypeName === 'MJPG') {
            SelectType = 2
          } else if (SubtypeName === 'UYVY') {
            SelectType = 4
          }
        }
        var nResolution = sResolution.selectedIndex
        this.Video = plugin().Device_CreateVideo(dev, nResolution, SelectType)
        if (this.Video) {
          view().View_SelectVideo(this.Video)
          view().View_SetText('打开视频中，请等待...', 0)
        }
      }
    },
    // 切换设备
    changeDev() {
      var sSubType = document.getElementById('subType')
      var sResolution = document.getElementById('selRes')
      // var lDeviceName = document.getElementById('lab1')
      var sDevice = document.getElementById('device')
      var dev = null
      console.log('sDevice.selectedIndex', sDevice.selectedIndex)
      if (sDevice.selectedIndex !== -1) {
        if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceMain)) {
          dev = this.DeviceMain// 选中主头
        } else if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceAssist)) {
          dev = this.DeviceAssist// 选中副头
        }
        sSubType.options.length = 0
        var subType = plugin().Device_GetSubtype(dev)
        if (subType & 1) {
          sSubType.add(new Option('YUY2'))
        }
        if (subType & 2) {
          sSubType.add(new Option('MJPG'))
        }
        if (subType & 4) {
          sSubType.add(new Option('UYVY'))
        }
        sSubType.selectedIndex = 0

        var SubtypeName
        var SelectType = ''
        if (sSubType.options.selectedIndex !== -1) {
          SubtypeName = sSubType.options[sSubType.options.selectedIndex].text
          if (SubtypeName === 'YUY2') {
            SelectType = 1
          } else if (SubtypeName === 'MJPG') {
            SelectType = 2
          } else if (SubtypeName === 'UYVY') {
            SelectType = 4
          }
        }
        var nResolution = plugin().Device_GetResolutionCountEx(dev, SelectType)// 根据出图模式获取分辨率
        sResolution.options.length = 0
        console.log('nResolution', nResolution)
        for (var i = 0; i < nResolution; i++) {
          var width = plugin().Device_GetResolutionWidthEx(dev, SelectType, i)
          var heigth = plugin().Device_GetResolutionHeightEx(dev, SelectType, i)
          sResolution.add(new Option(width.toString() + '*' + heigth.toString()))
        }
        sResolution.selectedIndex = 0
      }
    },
    changesubType() {
      var sSubType = document.getElementById('subType')
      var sResolution = document.getElementById('selRes')
      // var lDeviceName = document.getElementById('lab1')
      var sDevice = document.getElementById('device')
      var dev = null
      if (sDevice.selectedIndex !== -1) {
        if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceMain)) {
          dev = this.DeviceMain// 选中主头
        } else if (sDevice.selectedIndex === plugin().Device_GetIndex(this.DeviceAssist)) {
          dev = this.DeviceAssist// 选中副头
        }
        var SubtypeName = ''
        var SelectType = ''
        if (sSubType.options.selectedIndex !== -1) {
          SubtypeName = sSubType.options[sSubType.options.selectedIndex].text
          if (SubtypeName === 'YUY2') {
            SelectType = 1
          } else if (SubtypeName === 'MJPG') {
            SelectType = 2
          } else if (SubtypeName === 'UYVY') {
            SelectType = 4
          }
        }
        var nResolution = plugin().Device_GetResolutionCountEx(dev, SelectType)// 根据出图模式获取分辨率
        sResolution.options.length = 0
        for (var i = 0; i < nResolution; i++) {
          var width = plugin().Device_GetResolutionWidthEx(dev, SelectType, i)
          var heigth = plugin().Device_GetResolutionHeightEx(dev, SelectType, i)
          sResolution.add(new Option(width.toString() + '*' + heigth.toString()))
        }
        sResolution.selectedIndex = 0
      }
    },
    CloseVideo() {
      if (this.Video) {
        view().View_SetText('', 0)
        plugin().Video_Release(this.Video)
        this.Video = null
      }
    },
    Scan() {
      var date = new Date()
      var yy = date.getFullYear().toString()
      var mm = (date.getMonth() + 1).toString()
      var dd = date.getDate().toString()
      var hh = date.getHours().toString()
      var nn = date.getMinutes().toString()
      var ss = date.getSeconds().toString()
      var mi = date.getMilliseconds().toString()
      var Name = 'D:\\' + yy + mm + dd + hh + nn + ss + mi + '.jpg'
      var img = plugin().Video_CreateImage(this.Video, 0, view().View_GetObject())
      console.log(img, 'Scan')
      var bSave = plugin().Image_Save(img, Name, 0)
      if (bSave) {
        view().View_PlayCaptureEffect()
        thumb().Thumbnail_Add(Name)
      }
      plugin().Image_Release(img)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .g-p-wrap {
    display: inline-block;
    border: 1px solid #ccc;
  }
</style>
