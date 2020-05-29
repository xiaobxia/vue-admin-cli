<template>
  <div class="app-container">
    <!--<el-alert-->
    <!--title="主页"-->
    <!--type="success"/>-->
    <!--<el-button type="primary" @click="exportFile">主要<blank-space :len="12"/>按钮</el-button>-->
    <!--<el-tree-->
    <!--ref="tree"-->
    <!--:data="data"-->
    <!--:props="defaultProps"-->
    <!--:check-strictly="true"-->
    <!--show-checkbox-->
    <!--default-expand-all-->
    <!--node-key="id"-->
    <!--highlight-current-->
    <!--@check="treeCheck"/>-->
    <!--<div class="buttons">-->
    <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
    <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
    <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
    <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
    <!--<el-button @click="resetChecked">清空</el-button>-->
    <!--</div>-->
    <!--<el-button type="primary" @click="updateRouter">更新路由</el-button>-->
    <!--<el-select v-model="userStatus" placeholder="请选择" @change="userStatusChangeHandler">-->
    <!--<el-option label="全部" value=""/>-->
    <!--<el-option-->
    <!--v-for="item in $USER_STATUS_LIST"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value"/>-->
    <!--</el-select>-->
    <!--<div class="g-w">-->
    <!--<div class="icon-wrap">-->
    <!--<img src="../../assets/gzh.png" alt="">-->
    <!--</div>-->
    <!--<div class="text-wrap">-->
    <!--<div>新朋友点击<i class="el-icon-top"/>上方<span class="text">“养基定投波段”</span>，关注后在菜单使用信号工具</div>-->
    <!--<div>老朋友点击右上角<i class="el-icon-more"/>，分享文章给朋友</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="a">
      <div class="b">
        <div class="c">
          <div class="t">
            <span>基金课堂</span>
          </div>
          <div class="t-1">
            <div class="b-1"/>
            <div class="b-2"/>
            <span>养基定投波段</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import treeUtil from '@/utils/treeUtil'
import arrayUtil from '@/utils/arrayUtil'
import BlankSpace from '@/components/BlankSpace'

export default {
  name: 'Dashboard',
  components: { BlankSpace },
  data() {
    return {
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
      },
      userStatus: ''
    }
  },
  component: { BlankSpace },
  computed: {
  },
  created() {
    console.log(this.$route)
    console.log(this.$router)
  },
  methods: {
    exportFile() {
      this.$http.get('download/exportXlsx', {}, { responseType: 'arraybuffer' }).then((res) => {
        this.$downloadExcel(res, '用户列表', 'xlsx')
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
    updateRouter() {
    },
    userStatusChangeHandler(value) {
      console.log(this.$formatUserStatus(value) || '全部')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .g-w {
    position: relative;
    margin-top: 20px;
    width: 1082px;
    height: 165px;
    border: 1px solid #eee;
    .icon-wrap {
      position: absolute;
      left: 20px;
      top: 16px;
      height: 130px;
      width: 130px;
      border-radius: 130px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text-wrap {
      position: absolute;
      height: 100%;
      width: 900px;
      left: 180px;
      font-size: 28px;
      font-weight: 600;
      color: rgb(36, 41, 46);
      letter-spacing: 3px;
      padding: 20px 0;
      i {
        font-weight: 800;
      }
      div {
        line-height: 60px;
      }
      span {
        color: #337ab7;
      }
    }
  }
  .a {
    position: relative;
    width: 900px;
    height: 383px;
    color: rgb(255,208,108);
    background-color: rgb(183,32,51);
    .b {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 820px;
      height: 300px;
      background-color: rgba(255,208,108, 0.2);
    }
    .c {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 740px;
      height: 220px;
      border: 4px solid rgb(255,208,108);
    }
    .t {
      margin-top: 25px;
      text-align: center;
      font-size: 70px;
      letter-spacing: 60px;
      text-indent: 60px;
    }
    .t-1 {
      position: relative;
      margin-top: 30px;
      text-align: center;
      font-size: 40px;
      letter-spacing: 12px;
      text-indent: 12px;
    }
    .b-1, .b-2 {
      position: absolute;
      background-color: rgb(255,208,108);
      height: 6px;
      width: 120px;
      top: 20px;
    }
    .b-1 {
      left: 70px;
    }
    .b-2 {
      right: 70px;
    }
  }
</style>
