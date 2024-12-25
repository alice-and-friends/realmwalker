export function determineArticle(word: string): string {
  const firstLetter = word[0].toLowerCase();
  return 'aeiou'.includes(firstLetter) ? 'an' : 'a';
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function randomElement (arr: any[]) {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined
}

export function slug(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function formatList(items: string[]): string {
  // Check if the list is empty or has only one item
  if (items.length === 0) {
    return '';
  } else if (items.length === 1) {
    return items[0];
  }

  // Separate the last item
  const lastItem = items.pop();

  // Join the remaining items with a comma and add the Oxford comma plus "and" before the last item
  return `${items.join(', ')}, and ${lastItem}`;
}
