<template>
  <el-dialog
      :model-value="visible"
      title="添加选项"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @open="onOpen"
      @close="onClose">
    <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px">
      <el-col :span="24">
        <el-form-item label="选项名" prop="label">
          <el-input
              v-model="formData.label"
              placeholder="请输入选项名"
              clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
            label="选项值"
            prop="value"
        >
          <el-input
              v-model="formData.value"
              placeholder="请输入选项值"
              clearable
          >
            <template #append>
              <el-select
                  v-model="dataType"
                  :style="{width: '100px'}">
                <el-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-button
          type="primary"
          @click="handleConfirm">
        确定
      </el-button>
      <el-button @click="onClose">
        取消
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import {defineEmits, defineProps, reactive, ref, watch} from 'vue'

const visible = ref(true)

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  }
})

const emits = defineEmits(['commit', 'close'])
const ruleFormRef = ref()
const id = ref(100);
const formData = reactive({
  label: undefined,
  value: undefined
})
const rules = ref({
  label: [
    {
      required: true,
      message: '请输入选项名',
      trigger: 'blur'
    }
  ],
  value: [
    {
      required: true,
      message: '请输入选项值',
      trigger: 'blur'
    }
  ]
})
const dataType = ref('string')
const dataTypeOptions = ref([
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '数字',
    value: 'number'
  }
])

function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

watch(() => formData.value, (val) => {
  dataType.value = isNumberStr(val) ? 'number' : 'string'
})


function onOpen() {
  formData.label = undefined
  formData.value = undefined
}

function onClose() {
  emits('close')
}

function handleConfirm() {
  if ((isNumberStr(formData.value) && dataType.value !== 'number') || (!isNumberStr(formData.value) && dataType.value !== 'string')) {
    dataType.value = isNumberStr(formData.value) ? 'number' : 'string'
  }
  ruleFormRef.value.validate(valid => {
    if (!valid) return
    if (dataType.value === 'number') {
      formData.value = parseFloat(formData.value)
    }
    formData.id = id.value++
    emits('commit', formData)
    onClose()
  })

}


</script>
