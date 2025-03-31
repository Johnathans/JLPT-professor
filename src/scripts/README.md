# JLPT Data Scripts

This directory contains scripts for fetching and updating JLPT data from the Jisho API.

## Available Scripts

### `fetch-jlpt-data.ts`

This script fetches kanji and words for each JLPT level from the Jisho API and saves them to separate files in the `src/data` directory.

```bash
npx ts-node src/scripts/fetch-jlpt-data.ts
```

### `update-jlpt-data.ts`

This script updates the `jlpt-kanji.ts` file with data fetched from the Jisho API. It combines all JLPT levels into a single file.

```bash
npx ts-node src/scripts/update-jlpt-data.ts
```

## Using the Shell Script

For convenience, you can use the shell script in the root directory:

```bash
./fetch-jlpt-data.sh
```

This will run the `update-jlpt-data.ts` script and update the `jlpt-kanji.ts` file.

## Notes

- The scripts use the Jisho API, which may have rate limits. The scripts include delays to avoid hitting these limits.
- Fetching all data may take some time, especially for the higher JLPT levels.
- The scripts will create or update files in the `src/data` directory.
- The data is structured to work with the JLPT Professor application's existing code.

## Data Structure

The data is structured as follows:

```typescript
interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

interface WordData {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}
```

## Example Usage in Application

```typescript
import { getJlptLevelForKanji, N5_KANJI, N5_WORDS } from '@/data/jlpt-kanji';

// Get the JLPT level for a kanji
const level = getJlptLevelForKanji('日');
console.log(level); // 'N5'

// Get all N5 kanji
console.log(N5_KANJI);

// Get all N5 words
console.log(N5_WORDS);
```
