import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ViewUiPlus from 'view-ui-plus'
import './styles/color.css'
import './styles/index.less'
import {IMIOClient,IMIOClientOption,IMIOClientConnectStatus} from 'imio-sdk-lite'

const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
    .use(router)
    .use(ViewUiPlus)
    .mount('#app')

let clientOption = IMIOClientOption.newBuilder().whitAppId('25').whitDebug(true)
    .whitHost("192.168.31.35:8000").build();
let imioClient = IMIOClient.getInstance().whitOption(clientOption);