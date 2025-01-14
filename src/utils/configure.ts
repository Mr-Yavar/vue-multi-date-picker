import { ComponentMap } from '@/constants/ComponentMap'
import type { ComponentMapKeys, SubTypeKeys } from '@/types'

export function configure<T extends ComponentMapKeys>(type: T, subType: SubTypeKeys<T>) {
  console.log(type, subType)
  return ComponentMap[type][subType]
}
