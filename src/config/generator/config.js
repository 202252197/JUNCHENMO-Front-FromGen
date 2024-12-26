export const formConf = {
    formRef: 'formRef',
    formModel: 'customStore.commonform',
    size: 'default',
    labelPosition: 'right',
    labelWidth: 100,
    formRules: 'formRules',
    gutter: 15,
    disabled: false,
    span: 24,
    formBtns: true
}


export const inputComponents = [
    {
        label: '单行文本',
        tag: 'el-input',
        tagIcon: 'input',
        placeholder: '请输入',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        clearable: true,
        prepend: '',
        append: '',
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    {
        label: '小数',
        tag: 'el-input',
        type: "number",
        tagIcon: 'decimals',
        placeholder: '请输入',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        clearable: true,
        prepend: '',
        append: '',
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    {
        label: '整数',
        tag: 'el-input',
        type: "number",
        tagIcon: 'number',
        placeholder: '请输入',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        clearable: true,
        prepend: '',
        append: '',
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    {
        label: '多行文本',
        tag: 'el-input',
        tagIcon: 'textarea',
        type: 'textarea',
        placeholder: '请输入',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        autosize: {
            minRows: 4,
            maxRows: 4
        },
        style: {width: '100%'},
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    {
        label: '密码',
        tag: 'el-input',
        tagIcon: 'password',
        placeholder: '请输入',
        defaultValue: undefined,
        span: 24,
        'show-password': true,
        labelWidth: null,
        style: {width: '100%'},
        clearable: true,
        prepend: '',
        append: '',
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    /*{
        label: '计数器',
        tag: 'el-input-number',
        tagIcon: 'number',
        placeholder: '',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        min: undefined,
        max: undefined,
        step: undefined,
        'step-strictly': false,
        precision: undefined,
        'controls-position': '',
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    }*/
]

export const selectComponents = [
    {
        label: '下拉选择',
        tag: 'el-select',
        tagIcon: 'select',
        placeholder: '请选择',
        defaultValue: '',
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        clearable: true,
        disabled: false,
        required: true,
        filterable: false,
        multiple: false,
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }],
        regList: [],
        changeTag: true
    },
    {
        label: '级联选择',
        tag: 'el-cascader',
        tagIcon: 'cascader',
        placeholder: '请选择',
        defaultValue: [],
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        props: {
            multiple: false
        },
        'show-all-levels': true,
        disabled: false,
        clearable: true,
        filterable: false,
        required: true,
        options: [{
            value: 1,
            label: '选项1',
            children: [{
                value: 2,
                label: '选项1-1'
            }]
        }],
        'popper-append-to-body': false,
        'teleported': false,
        dataType: 'dynamic',
        labelKey: 'label',
        valueKey: 'value',
        childrenKey: 'children',
        separator: '/',
        regList: [],
        changeTag: true
    },
    {
        label: '单选框组',
        tag: 'el-radio-group',
        tagIcon: 'radio',
        defaultValue: undefined,
        span: 24,
        labelWidth: null,
        style: {},
        optionType: 'default',
        border: false,
        size: 'default',
        disabled: false,
        required: true,
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }],
        regList: [],
        changeTag: true
    },
    {
        label: '多选框组',
        tag: 'el-checkbox-group',
        tagIcon: 'checkbox',
        defaultValue: [],
        span: 24,
        labelWidth: null,
        style: {},
        optionType: 'default',
        size: 'default',
        disabled: false,
        required: true,
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }],
        regList: [],
        changeTag: true
    },
    {
        label: '开关',
        tag: 'el-switch',
        tagIcon: 'switch',
        defaultValue: false,
        span: 24,
        labelWidth: null,
        style: {
            '--el-switch-on-color': null,
            '--el-switch-off-color': null,
        },
        disabled: false,
        required: true,
        'active-text': '',
        'inactive-text': '',
        'active-value': true,
        'inactive-value': false,
        regList: [],
        changeTag: true
    },
    {
        label: '滑块',
        tag: 'el-slider',
        tagIcon: 'slider',
        defaultValue: null,
        span: 24,
        labelWidth: null,
        disabled: false,
        required: true,
        min: 0,
        max: 100,
        step: 1,
        'show-stops': false,
        range: false,
        regList: [],
        changeTag: true
    },
    {
        label: '时间选择',
        tag: 'el-time-picker',
        tagIcon: 'time',
        placeholder: '请选择',
        defaultValue: null,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        required: true,
        'picker-options': {
            selectableRange: '00:00:00-23:59:59'
        },
        format: 'HH:mm:ss',
        'value-format': 'HH:mm:ss',
        regList: [],
        changeTag: true
    },
    {
        label: '时间范围',
        tag: 'el-time-picker',
        tagIcon: 'time-range',
        defaultValue: null,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        required: true,
        'is-range': true,
        'range-separator': '至',
        'start-placeholder': '开始时间',
        'end-placeholder': '结束时间',
        format: 'HH:mm:ss',
        'value-format': 'HH:mm:ss',
        regList: [],
        changeTag: true
    },
    {
        label: '日期选择',
        tag: 'el-date-picker',
        tagIcon: 'date',
        placeholder: '请选择',
        defaultValue: null,
        type: 'date',
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        disabled: false,
        clearable: true,
        required: true,
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        readonly: false,
        regList: [],
        changeTag: true
    },
    {
        label: '日期范围',
        tag: 'el-date-picker',
        tagIcon: 'date-range',
        defaultValue: null,
        span: 24,
        labelWidth: null,
        style: {width: '100%'},
        type: 'daterange',
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        disabled: false,
        clearable: true,
        required: true,
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        readonly: false,
        regList: [],
        changeTag: true
    },
    {
        label: '评分',
        tag: 'el-rate',
        tagIcon: 'rate',
        defaultValue: 0,
        span: 24,
        labelWidth: null,
        style: {},
        texts: ['极差', '失望', '一般', '满意', '惊喜'],
        max: 5,
        'allow-half': false,
        'show-text': false,
        'show-score': false,
        disabled: false,
        required: true,
        regList: [],
        changeTag: true
    },
    {
        label: '颜色选择',
        tag: 'el-color-picker',
        tagIcon: 'color',
        defaultValue: null,
        labelWidth: null,
        'show-alpha': false,
        'color-format': '',
        disabled: false,
        required: true,
        size: 'default',
        regList: [],
        changeTag: true
    },
    {
        label: '上传',
        tag: 'el-upload',
        tagIcon: 'upload',
        action: 'https://jsonplaceholder.typicode.com/posts/',
        defaultValue: null,
        labelWidth: null,
        disabled: false,
        required: true,
        accept: '',
        name: 'file',
        'auto-upload': true,
        showTip: false,
        buttonText: '点击上传',
        fileSize: 2,
        sizeUnit: 'MB',
        'list-type': 'text',
        multiple: false,
        regList: [],
        changeTag: true
    }
]

export const layoutComponents = [
    {
        layout: 'rowFormItem',
        tagIcon: 'row',
        type: 'flex',
        justify: 'start',
        align: 'top',
        label: '行容器',
        layoutTree: true,
        children: []
    },
    /*{
        layout: 'colFormItem',
        label: '按钮',
        changeTag: true,
        labelWidth: null,
        tag: 'el-button',
        tagIcon: 'button',
        span: 24,
        default: '主要按钮',
        type: 'primary',
        size: 'default',
        disabled: false
    }*/
]


export const headTitleComponents = [
    {
        label: '一级标题',
        tag: 'h1',
        tagIcon: 'title-h1',
        changeTag: true,
        style: {
            flex: 1,
            color: "#1A93F9",
            fontSize: "18px",
            height: "25px",
            lineHeight: "25px",
            textShadow: "#5B96E9AB 2px 2px 3px",
            borderLeft: '5px solid #3f92d991',
            paddingLeft:  '10px'
        },
        class : 'head-title-h1'
    },
    {
        label: '二级标题',
        tag: 'h2',
        tagIcon: 'title-h2',
        changeTag: true,
        style: {
            flex: 1,
            color: "#1A93F9",
            fontSize: "15px",
            height: "24px",
            lineHeight: "24px",
            textShadow: "#5B96E9AB 2px 2px 3px",
            borderLeft: '5px solid rgb(81 97 237 / 57%)',
            paddingLeft:  '10px'
        },
        class : 'head-title-h2'
    }
]

export const componentsTypes = [
    {
        typeName: "标注型组件",
        svgIconName: 'component',
        typeList: headTitleComponents
    },
    {
        typeName: '输入型组件',
        svgIconName: 'component',
        typeList: inputComponents
    },
    {
        typeName: '选择型组件',
        svgIconName: 'component',
        typeList: selectComponents
    },
    {
        typeName: '布局型组件',
        svgIconName: 'component',
        typeList: layoutComponents
    }
]

// 组件rule的触发方式，无触发方式的组件不生成rule
export const trigger = {
    'el-input': 'blur',
    'el-input-number': 'blur',
    'el-select': 'change',
    'el-radio-group': 'change',
    'el-checkbox-group': 'change',
    'el-cascader': 'change',
    'el-time-picker': 'change',
    'el-date-picker': 'change',
    'el-rate': 'change'
}
