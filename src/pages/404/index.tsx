import { defineComponent } from 'vue'

import styles from './index.module.css'
import { Button } from '@/ui'
import router from '@/router'

export default defineComponent({
	name: 'Error404Page',
	setup() {
		return () => {
			return (
				<div class={styles.page}>
					<div class={styles.title}>404</div>
					<div>Лог не найден :(</div>
					<Button
            class={styles.backButton}
            whenClick={() => router.replace('/')}
          >К поиску</Button>
				</div>
			)
		}
	},

})
