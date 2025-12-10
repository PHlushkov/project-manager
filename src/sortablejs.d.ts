declare module 'sortablejs' {
  export interface SortableEvent {
    item: HTMLElement
    from: HTMLElement
    to: HTMLElement
    oldIndex: number | null
    newIndex: number | null
    pullMode: string | boolean
    willInsertAfter: boolean
  }

  export interface SortableOptions {
    group?: string | { name: string; pull?: boolean; put?: boolean }
    animation?: number
    onEnd?: (event: SortableEvent) => void
    [key: string]: any
  }

  export default class Sortable {
    static create(el: HTMLElement, options?: SortableOptions): Sortable
    destroy(): void
    [key: string]: any
  }
}
