import type { UserprofileV1CreateFavoriteQueryRequestDto } from '@/api/generated/seq-ui-server'
import type { normalizeFavoriteQuery } from '@/normalizers/profile'

export type FavoriteQuery = ReturnType<typeof normalizeFavoriteQuery>
export type SaveQueryParams =
  Required<Pick<UserprofileV1CreateFavoriteQueryRequestDto, 'query'>> &
  UserprofileV1CreateFavoriteQueryRequestDto
