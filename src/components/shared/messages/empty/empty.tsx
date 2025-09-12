import { defineComponent, computed } from 'vue'
import { prop } from '@fe/prop-types'

import styles from './empty.module.css'
import { Annoyed } from 'lucide-vue-next'

export const EmptyMessage = defineComponent({
	name: 'EmptyMessage',
	props: {
		actionHint: prop<string>().optional(),
		message: prop<string>().optional(),
		firstSearch: prop<boolean>().optional(false),
	},
	setup(props) {
		const getMessage = computed(() => {
			if (props.message) {
				return props.message
			}
			if (props.firstSearch) {
				return 'There will appear data'
			}
			return 'Nothing was found at your request'
		})

		return () => (
			<div class={styles.emptyMessage}>
        <Annoyed
          class={styles.emptyMessageIcon}
          size={32}
        />
				<div class={styles.textWrapper}>
					{props.actionHint && props.firstSearch && (
						<span class={[styles.emptyMessageTitle, styles.bold]}>
							{props.actionHint}
						</span>
					)}
					<span class={styles.emptyMessageTitle}>
						{getMessage.value}
					</span>
				</div>
			</div>
		)
	},
})
