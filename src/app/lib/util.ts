export function determineArticle(word: string): string {
  const firstLetter = word[0].toLowerCase();
  return 'aeiou'.includes(firstLetter) ? 'an' : 'a';
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
