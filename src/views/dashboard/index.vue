<template>
  <div class="dashboard-container">
    <el-alert
      title="主页"
      type="success"/>
    <el-button type="primary" @click="exportFile">主要按钮</el-button>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  components: { },
  data() {
    return {
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
    }
  }
}
</script>
