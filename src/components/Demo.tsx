import { defineComponent, ref } from 'vue'
import { Alert, Input } from 'view-ui-plus'
import styles from './Demo.module.less'

//测试 Buffer

// 直接使用全局 Buffer
const buf = Buffer.from('hello Buffer');
console.log(buf.toString('utf-8'));

export default defineComponent({
    setup() {
        const msg = ref('Hello View UI Plus!')
        
        return () => (
            <div class={styles.container}>
                <Alert show-icon>{msg.value}</Alert>
                <Input v-model={msg.value} />
            </div>
        )
    }
})