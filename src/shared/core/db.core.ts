export function dbArrayToArray<T>(source: string | any[]): T[] {
    return ((source || '').toString().match(/[\w.-]+/g) as any) || [];
}
