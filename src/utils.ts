export function hasCommonElement(arr1: string[], arr2: string[]) {
  return arr1.some((element) => arr2.includes(element));
}
