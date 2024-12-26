import {titleCase} from '@/utils/generator/index'
import {trigger} from '@/config/generator/config'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}


export function makeUpJs(conf, type) {
  confGlobal = conf = JSON.parse(JSON.stringify(conf))
  const dataList = []
  const ruleList = []
  const optionsList = []
  const propsList = []
  const methodList = mixinMethod(type)
  const uploadVarList = []

  conf.fields.forEach(el => {
    buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList)
  })

  const optionsListObj = []
  optionsList.forEach(el => {
    const key = el.substring(0, el.indexOf(':')).replaceAll('"', '')
    const value = el.substring(el.indexOf(':') + 1)
    optionsListObj.push(`const ${key} = ref(${value});`)
  })

  const propsListObj = []
  propsList.forEach(el => {
    const key = el.substring(0, el.indexOf(':')).replaceAll('"', '')
    const value = el.substring(el.indexOf(':') + 1)
    propsListObj.push(`const ${key} = ref(${value});`)
  })

  const script = buildexport(
      conf,
      type,
      dataList.join('\n'),
      ruleList.join('\n'),
      optionsListObj.join('\n'),
      uploadVarList.join('\n'),
      propsListObj.join('\n'),
      methodList.join('\n')
  )
  confGlobal = null
  return script
}

function buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList) {
  buildData(el, dataList)
  buildRules(el, ruleList)

  if (el.options && el.options.length) {
    buildOptions(el, optionsList)

    if (el.dataType === 'dynamic') {
      const model = `${el.vModel}Options`
      const options = titleCase(model)
      buildOptionMethod(`get${options}`, model, methodList)
    }
  }

  if (el.props) {
    buildProps(el, propsList)
  }

  if (el.action && el.tag === 'el-upload') {
    uploadVarList.push(
        `${el.vModel}Action: '${el.action}',
      ${el.vModel}fileList: [],`
    )
    methodList.push(buildBeforeUpload(el))
    if (!el['auto-upload']) {
      methodList.push(buildSubmitUpload(el))
    }
  }

  if (el.children) {
    el.children.forEach(el2 => {
      buildAttributes(el2, dataList, ruleList, optionsList, methodList, propsList, uploadVarList)
    })
  }
}

function mixinMethod(type) {
  const list = [];
  const
      minxins = {
        file: confGlobal.formBtns ? {
          submitForm: `function submitForm() {
        ${confGlobal.formRef}.value.validate(valid => {
          if(!valid) return
          // TODO 提交表单
        })
      }`,
          resetForm: `function resetForm() {
        ${confGlobal.formRef}.value.resetFields()
      }`
        } : null,
        dialog: {
          open: `const open = () => {
            instance?.proxy?.$resetObj(customStore.commonform)
            fromOpenStatus.value = true;
          }`,
          close: `const close = () => {
            instance?.proxy?.$resetObj(customStore.commonform)
            fromOpenStatus.value = false;
          }`,
          customItem: `const customItem = (formEl: FormInstance | undefined) => {
              if (!formEl) return
              formEl.validate((valid) => {
                if (valid) {
                  // TODO 提交表单
                } else {
                  //弹出数据校验失败的message
                  ElMessage.error({ message: '请将信息填写完整' })
                }
              })
            }`
        }
      }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

function buildData(conf, dataList) {
  if (conf.vModel === undefined) return
  let defaultValue
  if (typeof (conf.defaultValue) === 'string' && !conf.multiple) {
    defaultValue = `'${conf.defaultValue}'`
  } else {
    defaultValue = `${JSON.stringify(conf.defaultValue)}`
  }
  dataList.push(`${conf.vModel}: ${defaultValue},`)
}

function buildRules(conf, ruleList) {
  if (conf.vModel === undefined) return
  const rules = []
  if (trigger[conf.tag]) {
    if (conf.required) {
      const type = Array.isArray(conf.defaultValue) ? 'type: \'array\',' : ''
      let message = Array.isArray(conf.defaultValue) ? `请至少选择一个${conf.vModel}` : conf.placeholder
      if (message === undefined) message = `${conf.label}不能为空`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${trigger[conf.tag]}' }`)
    }
    if (conf.regList && Array.isArray(conf.regList)) {
      conf.regList.forEach(item => {
        if (item.pattern) {
          rules.push(`{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${trigger[conf.tag]}' }`)
        }
      })
    }
    ruleList.push(`${conf.vModel}: [${rules.join(',')}],`)
  }
}

function buildOptions(conf, optionsList) {
  if (conf.vModel === undefined) return
  if (conf.dataType === 'dynamic') {
    conf.options = []
  }
  const str = `"${conf.vModel}Options": ${JSON.stringify(conf.options)}`
  optionsList.push(str)
}

function buildProps(conf, propsList) {
  if (conf.dataType === 'dynamic') {
    conf.valueKey !== 'value' && (conf.props.value = conf.valueKey)
    conf.labelKey !== 'label' && (conf.props.label = conf.labelKey)
    conf.childrenKey !== 'children' && (conf.props.children = conf.childrenKey)
  }
  const str = `${conf.vModel}Props: ${JSON.stringify(conf.props)}`
  propsList.push(str)
}

function buildBeforeUpload(conf) {
  const unitNum = units[conf.sizeUnit];
  let rightSizeCode = '';
  let acceptCode = '';
  const
      returnList = []
  if (conf.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${conf.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${conf.fileSize}${conf.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (conf.accept) {
    acceptCode = `let isAccept = new RegExp('${conf.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${conf.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  const str = `function ${conf.vModel}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  }`
  return returnList.length ? str : ''
}

function buildSubmitUpload(conf) {
  const str = `submitUpload() {
    ${conf.vModel}.value.submit()
  },`
  return str
}

function buildOptionMethod(methodName, model, methodList) {
  const str = `function ${methodName}() {
    // TODO 发起请求获取数据
    ${model}
  }`
  methodList.push(str)
}

function formatJson(data) {
  if (data && data.length > 0) {
    data = `{${data}}`
    data = JSON.parse(data)
    const list = []
    for (const dataKey in data) {
      list.push(`const ${dataKey} = ref(${data.dataKey}); \n`)
    }
    return list
  }
  return data
}
/**
 * 
 * @param {*} conf 
 * @param {*} type 文件类型：file,dialog
 * @param {*} data 
 * @param {*} rules 
 * @param {*} selectOptions 
 * @param {*} uploadVar 
 * @param {*} props 
 * @param {*} methods 
 * @returns 
 */
function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, methods) {
  let str = ``
  if(type=='dialog') {
    str += `
    //导入表单规则
    import {formRules} from '../types/form.rules'
    import type {ComponentInternalInstance} from 'vue'
    //获取当前组件实例
    const instance:ComponentInternalInstance | null  = getCurrentInstance();
    //表单对象引用
    const ${confGlobal.formRef} = ref<FormInstance>()
    //添加表单打开的状态
    const fromOpenStatus = ref(false)
    //接收刷新父组件数据的方法
    const emit = defineEmits(['refreshData']);`
  }else{
    str += `//导入表单规则
    import { formRules } from './types/form.rules'
    //表单对象引用
    const ${confGlobal.formRef} = ref<FormInstance>()`
  }
  str += `//TODO 使用你的store 仓库
  // const customStore = useCustomStore();
  ${props}
  const ${conf.formModel} = reactive({${data}});
  const ${conf.formRules} = reactive({${rules}});
  ${uploadVar}
  ${selectOptions}
  ${methods}
`
  if(type=='dialog') {
    str += `defineExpose({ open });`
  }
  return str
}
