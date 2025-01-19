import type { DateStorage } from 'index.d.ts'

export interface Data<T extends ComponentMapKeys> {
  data: DateStorage<T> | null
}
