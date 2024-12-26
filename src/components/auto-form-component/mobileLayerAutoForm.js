import {resolveComponent} from "vue";

class MobileLayerAutoForm {
    constructor(options = {}, showMessage = false, successMsg = '操作成功', errorMsg = '操作失败') {
        
    }

    componentChild = {
        'el-button': {
            default(h, conf, key) {
                return conf[key]
            },
        },
        'el-input': {
            prepend(h, conf, key) {
                return h('div', null, {prepend: () => conf[key]})
            },
            append(h, conf, key) {
                return h('div', null, {append: () => conf[key]})
            }
        },
        'el-select': {
            options(h, conf, key) {
                const list = []
                conf.options.forEach(item => {
                    list.push(h(resolveComponent('el-option'), {label: item.label, value: item.value, disabled: item.disabled}))
                })
                return list
            }
        },
        'el-radio-group': {
            options(h, conf, key) {
                const list = []
                conf.options.forEach(item => {
                    if (conf.optionType === 'button') {
                        list.push(h(resolveComponent("el-radio-button"), {label: item.value}, {default: ()=> item.label}))
                    } else {
                        list.push(h(resolveComponent('el-radio'), {label: item.value, border: conf.border}, {default: ()=> item.label}))
                    }
                })
                return list
            }
        },
        'el-checkbox-group': {
           options(h, conf, key) {
             const list = []
             conf.options.forEach(item => {
               if (conf.optionType === 'button') {
                 list.push(h(resolveComponent("el-checkbox-button"), {label: item.value}, {default: ()=> item.label}))
               } else {
                 list.push(h(resolveComponent("el-checkbox"), {label: item.value}, {default: ()=> item.label}))
               }
             })
             return list
           }
         },
        'h1': {
            label(h, conf, key) {
                return conf[key]
            }
        },
        'h2': {
            label(h, conf, key) {
                return conf[key]
            }
        }

         /*'el-upload': {
           'list-type': (h, conf, key) => {
             const list = []
             if (conf['list-type'] === 'picture-card') {
               list.push(<i class="el-icon-plus"></i>)
             } else {
               list.push(<el-button size="small" type="primary" icon="el-icon-upload">{conf.buttonText}</el-button>)
             }
             if (conf.showTip) {
               list.push(<div slot="tip"
                              class="el-upload__tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的{conf.accept}文件</div>)
             }
             return list
           }
         }*/
    }

}


export default MobileLayerAutoForm