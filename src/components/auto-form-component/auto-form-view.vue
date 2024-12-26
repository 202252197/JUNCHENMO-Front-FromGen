<template>
  <div class="auto-form-view">

    <div class="auto-form-left">
      <div style="display: flex;align-items: center;justify-content: center;margin: 10px;">
        <svg-icon name="logo"/>
        <span style="font-size: 17px;">JCM FROM GEN</span>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <template v-for="componentItem in componentsTypes">
            <div class="components-title">
              <svg-icon :name="componentItem.svgIconName"/>
              {{componentItem.typeName}}
            </div>
            <draggable
                class="components-draggable" :list="componentItem.typeList"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :clone="cloneComponent"
                draggable=".components-item" :sort="false" @end="onEnd" :force-fallback="false"
                item-key="typeName"
            >
              <template #item="{element}">
                <div class="components-item" @click="addComponent(element)">
                  <div class="components-body">
                    <svg-icon :name="element.tagIcon"/>
                    {{ element.label }}
                  </div>
                </div>
              </template>
            </draggable>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <div class="auto-form-context">
      <div class="action-bar">
        <el-button link @click="download" :icon="Download">
          导出vue文件
        </el-button>
        <el-button link class="copy-btn-main" :icon="DocumentCopy" @click="copy">
          复制代码
        </el-button>
        <el-button link class="delete-btn" :icon="Delete" @click="empty">
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar" :noresize="true">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
              :style="{width: '100%'}"
              :size="formConfigRef.size"
              :label-position="formConfigRef.labelPosition"
              :disabled="formConfigRef.disabled"
              :label-width="formConfigRef.labelWidth + 'px'"
          >
            <draggable class="drawing-board"
                       item-key="renderKey"
                       :list="drawingList" :animation="340" group="componentsGroup">
              <template #item="{element,index}">
                <draggable-item
                    :key="element.renderKey"
                    :element="element"
                    :index="index"
                    :active-id="activeId"
                    :form-conf="formConfigRef"
                    :drawing-list="drawingList"
                    @activeItem="activeFormItem"
                    @copyItem="drawingItemCopy"
                    @deleteItem="drawingItemDelete"
                />
              </template>
            </draggable>
          </el-form>
          <div v-show="!drawingList.length" class="empty-info">
            <el-empty :image-size="200" :description="'从左侧拖入或点选组件进行表单设计'"/>
          </div>
        </el-row>
      </el-scrollbar>
    </div>
    <div class="auto-form-right">
      <auto-form-right v-model:active-data="activeData"  :form-conf="formConfigRef" :show-field="!!drawingList.length"
                                    @tag-change="tagChange"/>
    </div>
    <code-type-dialog  v-model="dialogVisible"
                                    title="选择生成类型"
                                    :show-file-name="showFileName"
                                    @update:visible="generateUpdate"
                                    @confirm="generate" />
    <input id="copyGenterNode" type="hidden">
  </div>
</template>

<script setup>
import {formConf, componentsTypes} from "@/config/generator/config.js"
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {Delete, DocumentCopy, Download} from "@element-plus/icons-vue";
import draggable from 'vuedraggable'
import {ElMessage, ElMessageBox} from "element-plus";
import MobileLayerDraggableItem from "@/components/auto-form-component/draggable-item.vue"
import MobileLayerAutoFormRight from "@/components/auto-form-component/auto-form-right.vue"
import MobileLayerCodeTypeDialog from "@/components/auto-form-component/code-type-dialog.vue"
import drawingDefault from "@/config/generator/drawingDefault.js";
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '@/utils/generator/html'
import { makeUpJs } from '@/utils/generator/js'
import { makeUpCss } from '@/utils/generator/css'
import ClipboardJS from 'clipboard'
import {beautifierConf,GeneratorSaveAs} from '@/utils/generator'
import beautifier from 'js-beautify'

let tempActiveData;
let oldActiveId;

const formConfigRef = reactive(formConf)
const drawingList = reactive(drawingDefault)
const activeData = ref(drawingDefault[0])
const activeId = ref(drawingDefault[0].formId)
const idGlobal = ref(100)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const showFileName = ref(false)
const operationType = ref('')
const generateConf = ref(null)
const formData = ref({})
// 防止 firefox 下 拖拽 会新打卡一个选项卡
document.body.ondrop = event => {
  event.preventDefault()
  event.stopPropagation()
}


const execFunction = {
  execRun: (data) => {
    AssembleFormData()
    drawerVisible.value = true
  },
  execDownload: (data) => {
    const codeStr = generateCode()
    const blob = new Blob([codeStr], {type: 'text/plain;charset=utf-8'})
    GeneratorSaveAs(blob, data.fileName)
  },
  execCopy: (data) => {
    document.getElementById('copyGenterNode').click()
  }
}

function onEnd(obj, a) {
  if (obj.from !== obj.to) {
    activeData.value = tempActiveData
    activeId.value = idGlobal.value
  }
}

function addComponent(item) {
  const clone = cloneComponent(item)
  drawingList.push(clone)
  activeFormItem(clone)
}

function activeFormItem(element) {
  activeData.value = element
  activeId.value = element.formId
}

function cloneComponent(origin) {
  const clone = JSON.parse(JSON.stringify(origin))
  clone.formId = ++idGlobal.value
  clone.span = formConfigRef.span
  clone.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件

  if (!clone.layout) {
    clone.layout = 'colFormItem'
  }
  if (clone.layout === 'colFormItem') {
    clone.tag !== 'h1' && clone.tag !== 'h2' && ( clone.vModel = `field${idGlobal.value}`)
    tempActiveData = clone
  } else if (clone.layout === 'rowFormItem') {
    delete clone.label
    clone.componentName = `row${idGlobal.value}`
    clone.gutter = formConfigRef.gutter
    tempActiveData = clone
  }
  return clone
}

function download() {
  dialogVisible.value = true
  showFileName.value = true
  operationType.value = 'download'
}

// 首字母大写
function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

function generateUpdate(isd) {
  dialogVisible.value = isd
}
function generate(data) {
  const func = execFunction[`exec${titleCase(operationType.value)}`]
  generateConf.value = data
  func && func(data)
}
function AssembleFormData() {
  formData.value = {
    fields: JSON.parse(JSON.stringify(drawingList)),
    ...formConfigRef
  }
}

function generateCode() {
  const { type,fileName } = generateConf.value

  AssembleFormData()
  const script = vueScript(makeUpJs(formData.value, type))
  const html = vueTemplate(makeUpHtml(formData.value, type),fileName)
  const css = cssStyle(makeUpCss(formData.value), fileName)
  return beautifier.html(html + script + css, beautifierConf.html)
}



function copy() {
  dialogVisible.value = true
  showFileName.value = false
  operationType.value = 'copy'
}

function drawingItemCopy(item, parent) {
  let clone = JSON.parse(JSON.stringify(item))
  clone = createIdAndKey(clone)
  parent.push(clone)
  activeFormItem(clone)
}

function createIdAndKey(item) {
  item.formId = ++idGlobal.value
  item.renderKey = +new Date()
  if (item.layout === 'colFormItem') {
    item.vModel = `field${idGlobal.value}`
  } else if (item.layout === 'rowFormItem') {
    item.componentName = `row${idGlobal.value}`
  }
  if (Array.isArray(item.children)) {
    item.children = item.children.map(childItem => createIdAndKey(childItem))
  }
  return item
}

function drawingItemDelete(index, parent) {
  parent.splice(index, 1)
  nextTick(() => {
    const len = drawingList.length
    if (len) {
      activeFormItem(drawingList[len - 1])
    }
  })
}


function tagChange(newTag) {
  newTag = cloneComponent(newTag)
  newTag.vModel = activeData.value.vModel
  newTag.formId = activeId.value
  newTag.span = activeData.value.span
  /*delete activeData.value.tag
  delete activeData.value.tagIcon
  delete activeData.value.defaultValue


  Object.keys(newTag).forEach(key => {
    if (activeData.value[key] !== undefined && typeof activeData.value[key] === typeof newTag[key] && key in activeData.value) {
      newTag[key] = activeData.value[key]
    }
  })
  activeData.value = newTag*/

  activeData.value.defaultValue = newTag.defaultValue

  activeData.value.label = newTag.label

  activeData.value = newTag


  updateDrawingList(newTag, drawingList)
}

function updateDrawingList(newTag, list) {
  const index = list.findIndex(item => item.formId === activeId.value)
  if (index > -1) {
    list.splice(index, 1, newTag)
  } else {
    list.forEach(item => {
      if (Array.isArray(item.children)) updateDrawingList(newTag, item.children)
    })
  }
}


function empty() {
  ElMessageBox.confirm(
      '确定要清空所有组件吗?',
      '提示?',
      {confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',})
      .then(() => {
        drawingList.splice(0, drawingList.length)
      })
}

onMounted(()=>{
  const clipboard = new ClipboardJS('#copyGenterNode', {
    text: trigger => {
      const codeStr = generateCode()
      ElMessage({
        message: '代码已复制到剪切板，可粘贴。',
        type: 'success'
      })
      return codeStr
    }
  })
  clipboard.on('error', e => {
    ElMessage({
      message: '代码复制失败。',
      type: 'error'
    })
  })
})


watch(() => activeId.value, function (val) {
  oldActiveId = val
})

watch(() => activeData.value.label, function (val, oldValue) {
  if (
      activeData.value.placeholder === undefined
      || !activeData.value.tag
      || oldActiveId !== activeId.value
  ) {
    return
  }
  activeData.value.placeholder = activeData.value.placeholder.replace(oldValue, '') + val
})
</script>

<style lang="scss">
$geo-basic-footer-height: 1px;


$selectedColor: #f6f7ff;
$lighterBlue: #409EFF;

.auto-form-view {
  height: calc(100% - $geo-basic-footer-height);
  display: flex;
  position: relative;
  width: 100%;
  background-color: white;

  .auto-form-left, .auto-form-right {
    flex: 1;
    position: absolute;
    border: 1px solid #eee;
    height: 100%;
  }

  .auto-form-left {
    width: 260px;
    left: 0;
    top: 0;

    .left-scrollbar {
      overflow: hidden;
      height: 100%;

      .components-list {
        padding: 8px;
        box-sizing: border-box;
        height: 100%;

        .components-item {
          display: inline-block;
          width: 48%;
          margin: 1%;
          transition: transform 0ms !important;
        }

        .components-title {
          display: flex;
          font-size: 14px;
          color: #222;
          margin: 6px 2px;

          .svg-icon {
            color: #666;
            font-size: 18px;
          }
        }
      }
    }

    .components-draggable {
      padding-bottom: 20px;

      .components-body {
        padding: 8px 10px;
        background: $selectedColor;
        font-size: 12px;
        cursor: move;
        border: 1px dashed $selectedColor;
        border-radius: 3px;
        display: flex;
        align-items: center;

        .svg-icon {
          color: #777;
          font-size: 15px;
        }

        &:hover {
          border: 1px dashed #787be8;
          color: #787be8;

          .svg-icon {
            color: #787be8;
          }
        }
      }
    }
  }

  .auto-form-right {
    width: 350px;
    right: 0;
    top: 0;

    .center-tabs {
      .el-tabs__header {
        margin-bottom: 0 !important;
      }

      .el-tabs__item {
        width: 50%;
        text-align: center;
      }

      .el-tabs__nav {
        width: 100%;
      }
    }

    .right-scrollbar {
      .el-scrollbar__view {
        padding: 12px 18px 15px 15px;
      }
    }

  }

  .auto-form-context {
    flex: 2;
    box-sizing: border-box;
    margin: 0 350px 0 260px;

    .action-bar {
      position: relative;
      height: 45px;
      padding: 0 15px;
      box-sizing: border-box;;
      border: 1px solid #f1e8e8;
      display: flex;
      justify-content: right;
      align-items: center;

      .delete-btn {
        color: #F56C6C;
      }
    }

    .center-scrollbar {
      height: calc(100% - 45px);
    }

    .el-scrollbar__view {
      height: 100%;
    }

    .center-board-row {
      padding: 12px 12px 15px 12px;
      box-sizing: border-box;
      height: 100%;
      position: relative;
    }

    .drawing-board {
       height: calc(100% - 30px * 2);
       padding: 30px 0;
      .components-body {
        padding: 0;
        margin: 0;
        font-size: 0;
      }

      .sortable-ghost {
        position: relative;
        display: block;
        overflow: hidden;

        &::before {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          background: rgb(89, 89, 223);
          z-index: 2;
        }
      }

      .components-item.sortable-ghost {
        width: 100%;
        height: 60px;
        background-color: $selectedColor;
      }

      .active-from-item {
        .el-form-item {
          background: $selectedColor;
          border-radius: 6px;
        }

        .drawing-item-copy, .drawing-item-delete {
          display: initial;
        }

        .component-name {
          color: $lighterBlue;
        }
      }

      .el-form-item {
        margin-bottom: 15px;
      }
    }

    .empty-info {
      position: absolute;
      width: 100%;
      top: 5px;
    }

    .drawing-item {
      position: relative;
      cursor: move;

      &.unfocus-bordered:not(.activeFromItem) > div:first-child {
        border: 1px dashed #ccc;
      }

      .el-form-item {
        padding: 12px 10px;
      }
    }

    .drawing-row-item {
      position: relative;
      cursor: move;
      box-sizing: border-box;
      border: 1px dashed #ccc;
      border-radius: 3px;
      padding: 0 2px;
      margin-bottom: 15px;

      .drawing-row-item {
        margin-bottom: 2px;
      }

      .el-col {
        margin-top: 22px;
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .drag-wrapper {
        width: 100%;
        min-height: 80px;
      }

      &.active-from-item {
        border: 1px dashed $lighterBlue;
      }

      .component-name {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 12px;
        color: #bbb;
        display: inline-block;
        padding: 0 6px;
      }
    }

    .drawing-item, .drawing-row-item {
      &:hover {
        .el-form-item {
          background: $selectedColor;
          border-radius: 6px;
        }

        .drawing-item-copy, .drawing-item-delete {
          display: initial;
        }
      }

      .drawing-item-copy, .drawing-item-delete {
        display: none;
        position: absolute;
        top: -10px;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 50%;
        font-size: 12px;
        border: 1px solid;
        cursor: pointer;
        z-index: 1;
      }

      .drawing-item-copy {
        right: 56px;
        border-color: $lighterBlue;
        color: $lighterBlue;
        background: #fff;

        &:hover {
          background: $lighterBlue;
          color: #fff;
        }
      }

      .drawing-item-delete {
        right: 24px;
        border-color: #F56C6C;
        color: #F56C6C;
        background: #fff;

        &:hover {
          background: #F56C6C;
          color: #fff;
        }
      }
    }
  }


}
</style>