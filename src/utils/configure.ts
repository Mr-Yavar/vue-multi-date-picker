import { ComponentMap } from '@/constants/ComponentMap'
import type MAP_ITEMS from '@/constants/MapItem'
import type { ComponentMapKeys, MapItemValues, SubTypeKeys } from '@/types'

export function configure<T extends ComponentMapKeys>(
  type: T,
  subType: SubTypeKeys<T>,
): MapItemValues {
  return ComponentMap[type][subType]
}
