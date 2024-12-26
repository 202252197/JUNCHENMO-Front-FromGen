import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/style.css'

import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import ComponentAutoRegister from "@/utils/ComponentAutoRegister"


const app = createApp(App)

new ComponentAutoRegister(app, import.meta.glob('@/components/**/*.vue'));
app.use(ElementPlus);


app.mount('#app')
