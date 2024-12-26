<template>
    <el-dialog
        v-bind="attrs"
        width="500px"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        @open="onOpen"
        @close="onClose"
    >
      <el-row :gutter="15">
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            size="default"
            label-width="100px"
        >
          <el-col :span="24">
            <el-form-item label="生成类型" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio-button
                    v-for="(item, index) in typeOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showFileName" label="文件名" prop="fileName">
              <el-input v-model="formData.fileName" placeholder="请输入文件名" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button @click="close">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </el-dialog>
</template>
<script setup>
import {defineProps,useAttrs,ref,reactive} from 'vue'
const props = defineProps({
  showFileName: {
  }
})
const emits = defineEmits(['update:visible','confirm'])
const attrs = useAttrs();
const formRef = ref()
const formData = reactive({
  fileName: undefined,
  type: 'file'
})
const rules = reactive({
  fileName: [{
    required: true,
    message: '请输入文件名',
    trigger: 'blur'
  }],
  type: [{
    required: true,
    message: '生成类型不能为空',
    trigger: 'change'
  }]
})
const typeOptions = reactive([{
  label: '页面',
  value: 'file'
}, {
  label: '弹窗',
  value: 'dialog'
}])


function onOpen() {
  if (props.showFileName) {
    formData.fileName = `${+new Date()}.vue`
  }
}
function onClose() {
}
function close(e) {
  emits('update:visible', false)
}
function handleConfirm() {
  formRef.value.validate(valid => {
    if (!valid) return
    emits('confirm', { ...formData })
    close()
  })
}


</script>
