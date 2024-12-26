<script>
import {defineComponent, h, markRaw, resolveComponent} from 'vue'
import {Delete, Document} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

const components = {
  itemBtns(h, element, index, parent, attrs) {
    const {onCopyItem, onDeleteItem} = attrs
    return [
      h('span', {
        class: 'drawing-item-copy', title: '复制', onClick: (event) => {
          onCopyItem(element, parent);
          event.stopPropagation();
        }
      }, [h(resolveComponent('el-icon'), null, {default: () => [h(Document)]})])

      ,

      h('span', {
        class: 'drawing-item-delete', title: '删除', onClick: (event) => {
          onDeleteItem(index, parent);
          event.stopPropagation();
        }
      }, [h(resolveComponent('el-icon'), null, {default: () => [h(Delete)]})])
    ]
  }
}
const layouts = {
  colFormItem(h, element, index, parent, attrs) {
    const {onActiveItem} = attrs
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'

    return h(
        resolveComponent('el-col'), {
          span: element.span, class: className, onClick: (event) => {
            onActiveItem(element);
            event.stopPropagation()
          }
        }, {
          default: () => [
            h(resolveComponent('el-form-item'),
                {
                  labelWidth: (element.tag !== 'h1' && element.tag !== 'h2') ? (element.labelWidth ? `${element.labelWidth}px` : null) : (element.tag === 'h1'? '1px': '10px'),
                  label: (element.tag !== 'h1' && element.tag !== 'h2' && element.label) || '',
                  required: element.required,
                }, {
                  default: () => [
                    h(resolveComponent('auto-form-render'), {
                      key: element.renderKey,
                      conf: element,
                      onClick: (event) => event.stopPropagation()
                    }),
                    components.itemBtns.apply(this, arguments)
                  ]
                }
            )
          ]
        })
  },
  rowFormItem(h, element, index, parent, attrs) {
    const {onActiveItem} = attrs
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
    const _this = this

    return h(resolveComponent('el-col'), {
          span: element.span,
        }, {
          default: () => [
            h(resolveComponent('el-row'), {
              gutter: element.gutter,
              class: className,
              onClick: (event) => {
                onActiveItem(element);
                event.stopPropagation();
              },
            }, {
              // TODO: 替换默认实现 tag node_modules/vuedraggable/src/core/renderHelper.js getRootInformation
              default: () => [
                h('span', {class: 'component-name'}, [element.componentName]),
                h(markRaw(draggable), {
                  list: element.children,
                  animation: 340,
                  group: "componentsGroup",
                  class: "drag-wrapper",
                  itemKey: `${element.renderKey}`,
                  tag: element.type === 'flex'? 'el-row': 'span',
                  justify: element.justify,
                  align: element.align
                }, {
                  item: (itemData) => {
                    const el = itemData.element
                    const ix = itemData.index
                    const layout = layouts[el.layout]
                    if (layout) {
                      let child = layout.call(_this, h, el, ix, element.children, attrs)
                      return [child]
                    } else {
                      return null;
                    }
                  }
                })
                ,
                components.itemBtns.apply(this, arguments)
              ]
            }),
          ]
        }
    );

  }
}

function layoutIsNotFound(self) {
  throw new Error(`没有与${self.element.layout}匹配的layout`)
}

export default defineComponent({
  props: {
    element: {
      type: Object
    },
    index: {
      type: Number
    },
    activeId: {
      type: Number
    },
    formConf: {
      type: Object
    },
    drawingList: {
      type: Array
    }
  },
  setup(props, {attrs}) {


    const layout = layouts[props.element.layout]
    console.log('props.element', props.element, props.index)
    if (layout) {
      return () => layout.call(props, h, props.element, props.index, props.drawingList, attrs)
    }
    return () => layoutIsNotFound(this)
  },


})


const rowFromItemComponent = defineComponent({
  props: {},
  setup(props) {

  }
})

</script>


