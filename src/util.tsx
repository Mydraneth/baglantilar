export function getUniqueIndexes(arrayLength: number, count: number): number[] {
    const result = new Set<number>();
    while (result.size < count) {
        const rand = Math.floor(Math.random() * arrayLength);
        result.add(rand);
    }
    return Array.from(result);
}
