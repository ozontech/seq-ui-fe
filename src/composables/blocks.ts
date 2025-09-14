import { reactive } from 'vue'

import { useBlock } from './block'
import { useCounter } from './use-counter'
import { useRouteQuery } from './route-query'

import { indexQueryKeys } from '~/helpers/search'

export type Block = ReturnType<typeof useBlock>

export const useBlocks = () => {
	const blocks: Map<number, Block> = reactive(new Map())

	const getBlock = (id: number) => blocks.get(id)!
	const getBlocks = () => Array.from(blocks.values() || [])

	const addBlock = (id?: number, opened = false) => {
		const block = useBlock(id, opened)
		blocks.set(block.id, block)
		return block
	}

	const addSeveralBlocks = (ids: number[]) => {
		for (let i = 0; i < ids.length; i++) {
			if (!blocks.get(ids[i])) {
				addBlock(ids[i], blocks.size === 0)
				useCounter().setDefault(Math.max(ids[i] + 1, ids.length))
			}
		}
	}

	const deleteBlock = (id: number) => {
		const keys = indexQueryKeys(id)
		const clearQuery = Object.fromEntries(keys.map((k) => [k, undefined]))
		useRouteQuery().batch(clearQuery)
		blocks.delete(id)
	}

	const clearBlocks = () => {
		useCounter().setDefault(0)
		useCounter().resetCounter()
		blocks.clear()
	}

	return {
		blocks,
		getBlocks,
		getBlock,
		addBlock,
		deleteBlock,
		addSeveralBlocks,
		clearBlocks,
	}
}
