<template>
  <div class="dashboard-container">
    <el-alert
      title="主页"
      type="success"/>
    <el-button type="primary" @click="exportFile">主要按钮</el-button>
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :check-strictly="true"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      @check="treeCheck"/>
    <div class="buttons">
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>
    <o-c-x ref="ocx" @onerror="errorHandler"/>
    <div>
      <el-button @click="getZhiWenTuXiang">获取指纹图像</el-button>
      <el-button @click="getZhiWenMuBan">获取指纹模板</el-button>
      <el-button @click="getZhiWenTezheng">获取指纹特征</el-button>
      <el-button @click="getMatch">指纹比对</el-button>
      <el-button @click="getDevVer">获取设备版本</el-button>
      <el-button @click="getOcxVer">获取库版本</el-button>
      <el-button @click="getAlgVer">获取算法版本</el-button>
    </div>
    <div>
      <div>{{ text }}</div>
      <div>
        <p>模板</p>
        <div>{{ zhiWenMuBan }}</div>
        <img v-for="(item, index) in imgList" v-if="item" :key="index" :src="item" alt="">
      </div>
      <div>
        <p>特征</p>
        <div>{{ zhiWenTezheng }}</div>
        <img v-if="imgUrl" :src="imgUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import treeUtil from '@/utils/treeUtil'
import arrayUtil from '@/utils/arrayUtil'
import OCX from '@/components/OCX'

export default {
  name: 'Dashboard',
  components: { OCX },
  data() {
    return {
      text: '',
      imgUrl: '',
      zhiWenMuBan: '',
      zhiWenTezheng: '',
      imgList: [],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    exportFile() {
      this.$http.get('download/exportXlsx', {}, { responseType: 'arraybuffer' }).then((res) => {
        this.downloadExcel(res, '用户列表', 'xlsx')
      })
    },
    treeCheck(a, b) {
      // 不需要管被点击的自己
      if (a.children && a.children.length > 0) {
        const rowCheckedKeys = b.checkedKeys
        const subKeys = treeUtil.getChildrenKeys(a.children, 'id')
        if (rowCheckedKeys.indexOf(a.id) !== -1) {
          // 选中状态
          const newCheckedKeys = arrayUtil.pushArray(rowCheckedKeys, subKeys)
          this.$refs.tree.setCheckedKeys(newCheckedKeys)
        } else {
          // 取消状态
          const newCheckedKeys = arrayUtil.removeArray(rowCheckedKeys, subKeys)
          this.$refs.tree.setCheckedKeys(newCheckedKeys)
        }
      }
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    errorHandler(text) {
      this.$message({
        message: text,
        type: 'error',
        duration: 5 * 1000
      })
    },
    getZhiWenTuXiang() {
      const res = this.$refs.ocx.getZhiWenTuXiang()
      this.text = res.text
      this.imgUrl = res.imgUrl
    },
    getZhiWenMuBan() {
      const res = this.$refs.ocx.getZhiWenMuBan()
      this.zhiWenMuBan = res.text
      this.imgList = res.imgUrlList
    },
    getZhiWenTezheng() {
      const res = this.$refs.ocx.getZhiWenTezheng()
      this.zhiWenTezheng = res.text
      this.imgUrl = res.imgUrl
    },
    getMatch() {
      const res = this.$refs.ocx.getMatch(this.zhiWenMuBan, this.zhiWenTezheng)
      if (res === 0) {
        alert('通过')
      } else if (res) {
        alert(res)
      }
    },
    getAlgVer() {
      alert(this.$refs.ocx.getAlgVer())
    },
    getOcxVer() {
      alert(this.$refs.ocx.getOcxVer())
    },
    getDevVer() {
      alert(this.$refs.ocx.getDevVer())
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
