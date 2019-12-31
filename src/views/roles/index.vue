<template>
  <div class="roles-container page-wrap">
    <div class="filter-wrap">
      <span class="f-label">角色状态</span>
      <el-select v-model="state" placeholder="" popper-class="ad-el" @change="reQuery">
        <el-option
          :value="2"
          label="全部"/>
        <el-option
          :value="0"
          label="启动"/>
        <el-option
          :value="1"
          label="停用"/>
      </el-select>
      <div class="right">
        <el-input
          v-model="searchText"
          class="has-right"
          placeholder="角色编码/名称"
          suffix-icon="el-icon-search"
          @change="reQuery"
        />
        <el-button type="primary" class="admin-t-btn" @click="addHandler">新增</el-button>
        <el-button type="primary" class="admin-t-btn" @click="editHandler">修改</el-button>
        <el-button type="primary" class="admin-t-btn" @click="deleteHandler">删除</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        prop="roleId"
        label="序号"
        width="80"/>
      <el-table-column
        prop="roleCode"
        label="角色编码"/>
      <el-table-column
        prop="roleName"
        label="角色名称"/>
      <el-table-column
        label="角色状态">
        <template slot-scope="scope">
          <span>
            <i v-if="scope.row.status===1" class="el-icon-error table-icon"/>
            <i v-else class="el-icon-success table-icon"/>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"/>
    </el-table>
    <div class="pageing">
      <el-pagination
        :current-page.sync="current"
        :page-size="10"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'新增':'修改'">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <template v-if="step === 1">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="必填,15个汉字内"/>
          </el-form-item>
          <el-form-item label="角色编码" prop="roleCode">
            <el-input :disabled="dialogType==='edit'" v-model="form.roleCode" placeholder="必填,10位任意字符"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="选填,30个汉字内"/>
          </el-form-item>
          <el-form-item label="角色状态" prop="status">
            <el-radio v-model="form.status" :label="0">启用</el-radio>
            <el-radio v-model="form.status" :label="1">停用</el-radio>
          </el-form-item>
        </template>
        <template v-if="step === 2">
          <el-form-item label="菜单权限">
            <el-checkbox-group v-model="menuIdList">
              <div v-for="(item, index) in menuList" :key="index">
                <el-checkbox :label="item.menuId">{{ item.name }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="step === 1">
          <el-button class="admin-c-btn" @click="cancelHandler">取消</el-button>
          <el-button type="primary" class="admin-t-btn" @click="nextStep">下一步</el-button>
        </template>
        <template v-if="step === 2">
          <el-button class="admin-c-btn" @click="lastStep">上一步</el-button>
          <el-button type="primary" class="admin-t-btn" @click="saveHandler">保存</el-button>
        </template>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogSVisible" title="提示">
      <div class="state-warn">
        <i class="el-icon-success"/>
        <span>{{ dialogSText }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="admin-t-btn" @click="dialogSVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogWVisible" title="提示">
      <div class="state-warn">
        <i class="el-icon-warning"/>
        <span>{{ dialogWText }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="admin-c-btn" @click="dialogWVisible = false">否</el-button>
        <el-button type="primary" class="admin-t-btn" @click="warnOk">是</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDVisible" title="提示">
      <div class="state-warn">
        <i class="el-icon-warning"/>
        <span>确定删除选中角色？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="admin-c-btn" @click="dialogDVisible = false">取消</el-button>
        <el-button type="primary" class="admin-t-btn" @click="deleteOkHandler">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
function createFormKey(tar) {
  const raw = {
    roleName: '',
    roleCode: '',
    remark: '',
    status: 0
  }
  if (tar) {
    for (const key in raw) {
      raw[key] = tar[key]
    }
  }
  return raw
}
export default {
  name: 'Roles',
  data() {
    return {
      searchText: '',
      state: 2,
      total: 0,
      current: 1,
      dialogVisible: false,
      dialogSVisible: false,
      dialogWVisible: false,
      dialogDVisible: false,
      dialogType: 'add',
      dialogSText: '',
      dialogWText: '',
      dialogWType: 'edit',
      step: 1,
      form: createFormKey(),
      rules: {
        roleName: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 15, message: '15个汉字内', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 10, max: 10, message: '10位任意字符', trigger: 'blur' }
        ],
        remark: [
          { max: 30, message: '30个汉字内', trigger: 'blur' }
        ]
      },
      tableData: [],
      menuList: [],
      selectIds: [],
      menuIdList: [],
      oldName: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.$http.get('sys/role/listMenu').then((res) => {
        this.menuList = res.data
      })
      this.queryList()
    },
    queryList() {
      this.selectIds = []
      this.$http.post('sys/role/list', {
        status: this.state,
        current: this.current,
        size: 10,
        roleName: this.searchText
      }).then((res) => {
        const data = res.data
        this.total = data.total
        this.tableData = data.records
      })
    },
    reQuery() {
      this.current = 1
      this.queryList()
    },
    handleCurrentChange() {
      this.queryList()
    },
    handleSelectionChange(val) {
      const ids = []
      val.forEach((item) => {
        ids.push(item.roleId)
      })
      this.selectIds = ids
    },
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('sys/role/checkBeforeSave', {
            ...this.form,
            isAdd: this.dialogType === 'add' ? 0 : 1,
            oldName: this.dialogType === 'add' ? '' : this.oldName
          }).then((res) => {
            this.step = 2
          })
        } else {
          return false
        }
      })
    },
    lastStep() {
      this.step = 1
    },
    cancelHandler() {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm() {
      this.form = createFormKey()
      this.menuIdList = []
    },
    addHandler() {
      this.resetForm()
      this.step = 1
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    deleteHandler() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择角色',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.$http.post('sys/role/checkBeforeDelete', {
          roleIds: this.selectIds.join(',')
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            this.openDialogW(`选择的${res.data.join(',')}等角色已被用户引用,是否继续删除`, 'delete')
          } else {
            this.dialogDVisible = true
          }
        })
      }
    },
    deleteOkHandler() {
      this.$http.post('sys/role/delete', {
        roleIds: this.selectIds.join(',')
      }).then((res) => {
        this.dialogDVisible = false
        this.queryList()
        this.openDialogS('删除成功！（times后自动关闭）', 3)
      })
    },
    queryRoleInfo() {
      this.$http.get('sys/role/info', {
        roleId: this.selectIds[0]
      }).then((res) => {
        this.form = createFormKey(res.data)
        this.menuIdList = res.data.menuIdList
        this.oldName = this.form.roleName
      })
    },
    editHandler() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择角色',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (this.selectIds.length !== 1) {
        this.$message({
          message: '一次只能修改一个',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.$http.post('sys/role/checkBeforeDelete', {
          roleIds: this.selectIds.join(',')
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            this.openDialogW(`选择的角色已被用户引用,是否继续修改`, 'edit')
          } else {
            this.toEdit()
          }
        })
      }
    },
    toEdit() {
      this.step = 1
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.dialogWVisible = false
      this.queryRoleInfo()
    },
    saveHandler() {
      if (this.dialogType === 'add') {
        this.$http.post('sys/role/save', {
          ...this.form,
          createUserId: this.userInfo.createUserId,
          menuIdList: this.menuIdList.join(',')
        }).then((res) => {
          this.cancelHandler()
          this.reQuery()
          this.openDialogS('保存成功！（times后自动关闭）', 3)
        })
      } else {
        this.$http.post('sys/role/update', {
          ...this.form,
          roleId: this.selectIds[0],
          createUserId: this.userInfo.createUserId,
          menuIdList: this.menuIdList.join(',')
        }).then((res) => {
          this.cancelHandler()
          this.reQuery()
          this.openDialogS('保存成功！（times后自动关闭）', 3)
        })
      }
    },
    openDialogS(text, time) {
      this.dialogSText = text.replace('time', time)
      this.dialogSVisible = true
      const timer = setInterval(() => {
        time--
        if (time === 0) {
          this.dialogSVisible = false
          clearInterval(timer)
        } else {
          this.dialogSText = text.replace('time', time)
        }
      }, 1000)
    },
    warnOk() {
      if (this.dialogWType === 'edit') {
        this.toEdit()
      }
      if (this.dialogWType === 'delete') {
        this.dialogDVisible = true
      }
      this.dialogWVisible = false
    },
    openDialogW(text, type) {
      this.dialogWText = text
      this.dialogWType = type
      this.dialogWVisible = true
    }
  }
}
</script>
