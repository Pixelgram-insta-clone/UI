export interface PageOfItems<Type> {
    items: Type[],
    hasNext: boolean,
    totalElements: number
}
