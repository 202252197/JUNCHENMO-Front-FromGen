<template>
  <component :is="props.conf.tag" v-bind="cloneConf"  v-model="valueVal" >
      <template #default v-for="(itm,childKey) in form.componentChild[props.conf?.tag]">
          <Childer  v-if="props.conf[childKey]"  :tag="props.conf.tag" :conf="props.conf" :child-key="childKey" />
      </template>
  </component>
</template>

<script setup>
import {defineComponent, defineProps, h, ref, watch, watchEffect} from 'vue';
import MobileLayerAutoForm from './mobileLayerAutoForm';

const props = defineProps({
  conf: {
    type: Object,
    required: true
  },
});

const form = new MobileLayerAutoForm();
const valueVal = ref(props.conf.defaultValue)
const cloneConf = ref(props.conf)

watch(props.conf,(value) => {
    console.debug("数据变化", value)
    cloneConf.value = {...props.conf}
    valueVal.value = props.conf.defaultValue
    // checkbox 中tag 不能替换为此处tag的含义
    delete cloneConf.value.tag
    delete cloneConf.value.defaultValue
},{deep: true, immediate:true})

watch(valueVal,(value)=>{
  props.conf.defaultValue = value
})


/*
const children = ref([])

const childObjs = form.componentChild[props.conf?.tag];

if (childObjs) {
  Object.keys(childObjs).forEach((key) => {
    const childFunc = childObjs[key];
    if (props.conf[key]) {
      children.value.push(childFunc(h, props.conf, key));
    }
  });
}*/

const Childer = defineComponent({
  props: {
    tag: {
      type: String,
      required: true
    },
    childKey: {
      type: String,
      required: true
    },
    conf: {
      type: Object,
      required: true
    }
  },
  setup(props,{attrs}) {
    return () => h('div', null , [form.componentChild[props.tag][props.childKey]?.(h, props.conf, props.childKey)]);
  },
});

</script>

<style lang="scss" scoped>
</style>
