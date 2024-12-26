import {defineAsyncComponent} from "vue";

// 组件自动注册
class ComponentAutoRegister {
    constructor(app, componentList) {
        for (const fileName in componentList) {
            let split = fileName.split("/");
            const componentName = split[split.length - 1].replace(".vue", "");
            const componentConfig = componentList[fileName];
            // 不能直接引入，vue3使用的是懒加载，参数是一个异步函数
            app.component(componentName, defineAsyncComponent(componentConfig));
        }
    }
}

export default ComponentAutoRegister;
