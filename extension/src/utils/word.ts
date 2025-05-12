export function splitIntoPseudoSyllables(word: string): string[] {
  if (!word || word.length <= 2) return [word]; // Don't split very short words

  const syllables: string[] = [];
  const vowels = "aeiouyAEIOUY";
  let currentSyllable = "";
  let hasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    currentSyllable += char;

    if (vowels.includes(char)) {
      hasVowel = true;
    }

    // Simple syllable division rules:
    // 1. After having at least one vowel
    // 2. When we have a consonant followed by a vowel (CV pattern)
    // 3. Or when syllable reaches optimal length (2-3 characters)
    if (hasVowel && i < word.length - 1) {
      const nextChar = word[i + 1];

      if (
        (!vowels.includes(char) && vowels.includes(nextChar)) || // Consonant-Vowel boundary
        currentSyllable.length >= 3 // Optimal syllable length
      ) {
        syllables.push(currentSyllable);
        currentSyllable = "";
        hasVowel = false;
      }
    }
  }

  // Add any remaining characters as final syllable
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  return syllables;
}
