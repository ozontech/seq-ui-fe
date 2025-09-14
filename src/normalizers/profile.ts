import type { UserprofileV1FavoriteQueryDto } from '~/api/generated/seq-ui-server'

export const normalizeFavoriteQuery = ({ id, name, query, relativeFrom }: UserprofileV1FavoriteQueryDto) => ({
	id: id || '',
	name: name || '',
	query: query || '',
	relativeFrom: relativeFrom ? Number(relativeFrom) : undefined,
} as {
	id: string
	query: string
	relativeFrom?: number
	name?: string
})
