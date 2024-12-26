<template>
  <div class="auto-right">
    <el-tabs v-model="currentTab" class="center-tabs" :style="{'--el-tabs-header-height': '40px'}">
      <el-tab-pane label="组件属性" name="field"/>
      <el-tab-pane label="表单属性" name="form"/>
    </el-tabs>

    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!--组件属性-->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.changeTag" label="组件类型">
            <el-select
                v-model="activeData.tagIcon"
                placeholder="请选择组件类型"
                :style="{width: '100%'}"
                @change="tagChange"
            >
              <el-option-group v-for="group in componentsTypes" :key="group.typeName" :label="group.typeName">
                <el-option
                    v-for="item in group.typeList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.tagIcon">
                  <svg-icon class="node-icon" :name="item.tagIcon"/>
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.vModel!==undefined" label="字段名">
            <el-input v-model="activeData.vModel" placeholder="请输入字段名（v-model）"/>
          </el-form-item>

          <el-form-item v-if="activeData.componentName!==undefined" label="组件名">
            {{ activeData.componentName }}
          </el-form-item>

          <el-form-item v-if="activeData.label!==undefined" label="标题">
            <el-input v-model="activeData.label" placeholder="请输入标题"/>
          </el-form-item>

          <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示"/>
          </el-form-item>


          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
            <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示"/>
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
            <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示"/>
          </el-form-item>

          <el-form-item v-if="activeData.span!==undefined" label="表单栅格">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange"/>
          </el-form-item>

          <el-form-item v-if="activeData.layout==='rowFormItem'" label="栅格间隔">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔"/>
          </el-form-item>

          <el-form-item v-if="activeData.layout==='rowFormItem'" label="布局模式">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default"/>
              <el-radio-button label="flex"/>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
            <el-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{width: '100%'}">
              <el-option
                  v-for="(item, index) in justifyOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top"/>
              <el-radio-button label="middle"/>
              <el-radio-button label="bottom"/>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template #append>
                个字符
              </template>
            </el-input>
          </el-form-item>

          <el-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
            <el-input v-model="activeData['active-text']" placeholder="请输入开启提示"/>
          </el-form-item>

          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
            <el-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示"/>
          </el-form-item>

          <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
            <el-input
                :value="setDefaultValue(activeData['active-value'])"
                placeholder="请输入开启值"
                @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>

          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
            <el-input
                :value="setDefaultValue(activeData['inactive-value'])"
                placeholder="请输入关闭值"
                @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>

          <el-form-item
              v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag"
              label="时间类型"
          >
            <el-select
                v-model="activeData.type"
                placeholder="请选择时间类型"
                :style="{ width: '100%' }"
                @change="dateTypeChange"
            >
              <el-option
                  v-for="(item, index) in dateOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符"/>
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <el-input
                v-model="activeData['picker-options'].selectableRange"
                placeholder="请输入时间段"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="时间格式">
            <el-input
                :value="activeData.format"
                placeholder="请输入时间格式"
                @input="setTimeValue($event)"
            />
          </el-form-item>

          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
            <draggable
                v-model="activeData.options"
                :animation="340"
                group="selectItem"
                handle=".option-drag"
                :item-key="(ele)=> { return `${activeData.renderKey + activeData.formId}`; }"
            >
              <template #item="{element, index}" :key="element.label + index">
                <div class="select-item">
                  <div class="select-line-icon option-drag">
                    <el-icon>
                      <Operation/>
                    </el-icon>
                  </div>
                  <el-input placeholder="选项名" size="small" v-model="activeData.options[index].label"/>
                  <el-input placeholder="选项值" size="small" v-model="element.value"/>
                  <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                    <el-icon>
                      <RemoveFilled/>
                    </el-icon>
                  </div>
                </div>
              </template>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button
                  style="padding-bottom: 0"
                  :icon="CirclePlus"
                  @click="addSelectItem"
                  link
              >
                添加选项
              </el-button>
            </div>
            <el-divider/>
          </template>


          <template v-if="['el-cascader'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
             <el-form-item label="数据类型">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button label="dynamic">
                  动态数据
                </el-radio-button>
                <el-radio-button label="static">
                  静态数据
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <el-form-item label="标签键名">
                <el-input v-model="activeData.labelKey" placeholder="请输入标签键名" />
              </el-form-item>
              <el-form-item label="值键名">
                <el-input v-model="activeData.valueKey" placeholder="请输入值键名" />
              </el-form-item>
              <el-form-item label="子级键名">
                <el-input v-model="activeData.childrenKey" placeholder="请输入子级键名" />
              </el-form-item>
            </template>

            <el-tree
                v-if="activeData.dataType === 'static'"
                draggable
                :data="activeData.options"
                node-key="id"
                :expand-on-click-node="false"
                :render-content="renderContent"
            />
            <div style="margin-left: 20px"  v-if="activeData.dataType === 'static'">
              <el-button
                  style="padding-bottom: 0"
                  :icon="CirclePlus"
                  link
                  @click="addTreeItem"
              >
                添加父级
              </el-button>
            </div>
            <el-divider/>
          </template>

          <el-form-item v-if="activeData.optionType !== undefined" label="选项样式">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="button">
                按钮
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData.style?.['--el-switch-on-color'] !== undefined" label="开启颜色">
            <el-color-picker v-model="activeData['style']['--el-switch-on-color']" />
          </el-form-item>

          <el-form-item v-if="activeData.style?.['--el-switch-off-color'] !== undefined" label="关闭颜色">
            <el-color-picker v-model="activeData['style']['--el-switch-off-color']" />
          </el-form-item>


          <el-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="范围选择">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item
              v-if="activeData.border !== undefined && activeData.optionType === 'default'"
              label="是否带边框"
          >
            <el-switch v-model="activeData.border" />
          </el-form-item>

          <el-form-item
              v-if="activeData.size !== undefined &&
              (activeData.optionType === 'button' ||
                activeData.border ||
                activeData.tag === 'el-color-picker')"
              label="选项尺寸"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="large">
                稍大
              </el-radio-button>
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="small">
                较小
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="严格步数">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="是否多选">
            <el-switch v-model="activeData.props.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="展示全路径">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="可否筛选">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" label="是否可搜索">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" label="是否多选">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.required" />
          </el-form-item>


          <template v-if="activeData.layoutTree">
            <el-divider>布局结构树</el-divider>
            <el-tree
                :data="[activeData]"
                :props="layoutTreeProps"
                node-key="renderKey"
                default-expand-all
                draggable
            >
              <template #default="{node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :name="data.tagIcon" />
                  {{ node.label }}
                </span>
              </template>
            </el-tree>
          </template>


          <template v-if="activeData.layout === 'colFormItem' && !(['el-button','h1', 'h2'].includes(activeData.tag))">
            <el-divider>正则校验</el-divider>
            <div
                v-for="(item, index) in activeData.regList"
                :key="index"
                class="reg-item"
            >
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button :icon="CirclePlus" link @click="addReg">
                添加规则
              </el-button>
            </div>
          </template>


        </el-form>

        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="large">
                稍大
              </el-radio-button>
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="small">
                较小
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                左对齐
              </el-radio-button>
              <el-radio-button label="right">
                右对齐
              </el-radio-button>
              <el-radio-button label="top">
                顶部对齐
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="组件边框">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>

      </el-scrollbar>
    </div>

    <auto-form-tree-node-dialog v-if="dialogVisible"  @commit="addNode" @close="()=>{dialogVisible = false}" />

  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import {computed, defineProps, reactive, ref, resolveComponent, watch} from 'vue';
import {componentsTypes, inputComponents, selectComponents} from "@/config/generator/config";
import {CirclePlus, Minus, Operation, Plus, RemoveFilled} from '@element-plus/icons-vue'



const currentTab = ref('field')

const props = defineProps({
  showField: {
    type: Boolean,
    required: true
  },
  activeData: {
    type: Object,
    required: true
  },
  formConf: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['tag-change'])

const layoutTreeProps = ref({
  label(data, node) {
    return data.componentName || `${data.label}: ${data.vModel}`
  }
})

const dateOptions = computed(() => {
  if (
      props.activeData.type !== undefined
      && props.activeData.tag === 'el-date-picker'
  ) {
    if (props.activeData['start-placeholder'] === undefined) {
      return dateTypeOptions
    }
    return dateRangeTypeOptions
  }
  return []
})

const idGlobal = ref(120)

const currentNode = ref(null)

const dialogVisible = ref(false)

const iconsVisible = ref(false)

const currentIconModel = ref(null);

const dateTypeOptions = reactive([
  {
    label: '日(date)',
    value: 'date'
  },
  {
    label: '周(week)',
    value: 'week'
  },
  {
    label: '月(month)',
    value: 'month'
  },
  {
    label: '年(year)',
    value: 'year'
  },
  {
    label: '日期时间(datetime)',
    value: 'datetime'
  }
])

const colorFormatOptions = reactive([
  {
    label: 'hex',
    value: 'hex'
  },
  {
    label: 'rgb',
    value: 'rgb'
  },
  {
    label: 'rgba',
    value: 'rgba'
  },
  {
    label: 'hsv',
    value: 'hsv'
  },
  {
    label: 'hsl',
    value: 'hsl'
  }
])

const justifyOptions = reactive([
  {
    label: 'start',
    value: 'start'
  },
  {
    label: 'end',
    value: 'end'
  },
  {
    label: 'center',
    value: 'center'
  },
  {
    label: 'space-around',
    value: 'space-around'
  },
  {
    label: 'space-between',
    value: 'space-between'
  }
])


const dateTimeFormat = {
  date: 'YYYY-MM-DD',
  week: 'YYYY 第 ww 周',
  month: 'YYYY-MM',
  year: 'YYYY',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  daterange: 'YYYY-MM-DD',
  monthrange: 'YYYY-MM',
  datetimerange: 'YYYY-MM-DD HH:mm:ss'
}

const dateRangeTypeOptions = reactive([
  {
    label: '日期范围(daterange)',
    value: 'daterange'
  },
  {
    label: '月范围(monthrange)',
    value: 'monthrange'
  },
  {
    label: '日期时间范围(datetimerange)',
    value: 'datetimerange'
  }
]);


function tagChange(tagIcon) {
  let target = inputComponents.find(item => item.tagIcon === tagIcon)
  if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
  emits('tag-change', target)
}

function spanChange(val) {
  props.formConf.span = val
}


function setTimeValue(val, type) {
  const valueFormat = type === 'week' ? dateTimeFormat.date : val
  props.activeData.defaultValue = null
  props.activeData['value-format'] = valueFormat
  props.activeData.format = val
}

function dateTypeChange(val) {
  setTimeValue(dateTimeFormat[val], val)
}

function onSwitchValueInput(val, name) {
  if (['true', 'false'].indexOf(val) > -1) {
    props.activeData[name] = JSON.parse(val)
  } else {
    props.activeData[name] = isNumberStr(val) ? +val : val
  }
}

function setDefaultValue(val) {
  if (Array.isArray(val)) {
    return val.join(',')
  }
  if (['string', 'number'].indexOf(val) > -1) {
    return val
  }
  if (typeof val === 'boolean') {
    return `${val}`
  }
  return val
}



function addSelectItem() {
  props.activeData.options.push({
    label: '',
    value: ''
  })
}


function addTreeItem() {
  ++idGlobal.value
  dialogVisible.value = true
  currentNode.value = props.activeData.options
}

function renderAppend(data) {
  if (!data.children) {
    data.children = []
  }
  dialogVisible.value = true
  currentNode.value = data.children
}

function renderRemove(node, data) {
  const {parent} = node
  const children = parent.data.children || parent.data
  const index = children.findIndex(d => d.id === data.id)
  children.splice(index, 1)
}

function renderContent(h, {node, data, store}) {
  return h('div', {class: 'custom-tree-node'}, [
    h('span', null, [node.label]),
    h('span', {class: 'node-operation'}, [
      h(resolveComponent('el-icon'), {
        title: '添加',
        class: 'el-icon-plus',
        onClick: () => renderAppend(data)
      }, {default: () => h(Plus)}),
      h(resolveComponent('el-icon'), {
        title: '删除',
        class: 'el-icon-delete',
        onClick: () => renderRemove(node, data)
      }, {default: () => h(Minus)})
    ])
  ]);
}

function addNode(data) {
  currentNode.value.push(data)
}


function rangeChange(val) {
  if (val) {
    props.activeData.defaultValue = [props.activeData.min, props.activeData.max]
  } else {
    props.activeData.min = props.activeData?.defaultValue?.[0] || 0;
    props.activeData.max = props.activeData?.defaultValue?.[1] || 100;
    props.activeData.defaultValue = props.activeData.min
  }
}
function rateTextChange(val) {
  if (val) props.activeData['show-score'] = false
}
function rateScoreChange(val) {
  if (val) props.activeData['show-text'] = false
}
function multipleChange (val) {
  if (val) {
    props.activeData.defaultValue = []
  } else {
    props.activeData.defaultValue = ''
  }
}

function addReg() {
  if (!props.activeData?.regList) {
    props.activeData.regList = []
  }
  props.activeData?.regList.push({
    pattern: '',
    message: ''
  })
}

// 解决 切换了type draggable的tag后 不能滑动的bug
watch(() => props.activeData.type, (value) => {
  props.activeData.renderKey = +new Date()
})

</script>

<style lang="scss">
.auto-right {
  width: 100%;
  height: 100%;
  margin: 5px 0;

  .field-box {
    box-sizing: border-box;
    height: calc(100% - 40px);
    .right-scrollbar {
      height: calc(100% - 40px);
    }
  }

  .custom-tree-node {
    width: 100%;
    font-size: 14px;

    .node-operation {
      float: right;
    }

    i[class*="el-icon"] + i[class*="el-icon"] {
      margin-left: 6px;
    }

    .el-icon-plus {
      color: #409EFF;
    }

    .el-icon-delete {
      color: #157a0c;
    }
  }

  .right-board {
    width: 350px;
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 3px;

    .field-box {
      position: relative;
      height: calc(100vh - 42px);
      box-sizing: border-box;
      overflow: hidden;
    }

    .el-scrollbar {
      height: 100%;
    }
  }

  .select-item {
    display: flex;
    border: 1px dashed #fff;
    box-sizing: border-box;

    & .close-btn {
      cursor: pointer;
      color: #f56c6c;
    }

    & .el-input + .el-input {
      margin-left: 4px;
    }
  }

  .select-item + .select-item {
    margin-top: 4px;
  }

  .select-item.sortable-chosen {
    border: 1px dashed #409eff;
  }

  .select-line-icon {
    line-height: 32px;
    font-size: 22px;
    padding: 0 4px;
    color: #777;
  }

  .option-drag {
    cursor: move;
  }

  .time-range {
    .el-date-editor {
      width: 227px;
    }

    ::v-deep .el-icon-time {
      display: none;
    }
  }

  .document-link {
    position: absolute;
    display: block;
    width: 26px;
    height: 26px;
    top: 0;
    left: 0;
    cursor: pointer;
    background: #409eff;
    z-index: 1;
    border-radius: 0 0 6px 0;
    text-align: center;
    line-height: 26px;
    color: #fff;
    font-size: 18px;
  }

  .node-label {
    font-size: 14px;
  }

  .node-icon {
    color: #bebfc3;
  }
}
</style>