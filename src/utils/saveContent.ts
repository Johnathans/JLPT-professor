import fs from 'fs';
import path from 'path';

export const saveContent = async (level: string, type: string, data: any) => {
  try {
    // Create directory path if it doesn't exist
    const dirPath = path.join(process.cwd(), 'src', 'data', 'jlpt', level, type);
    await fs.promises.mkdir(dirPath, { recursive: true });
    const filePath = path.join(process.cwd(), 'src', 'data', 'jlpt', level, type, 'index.ts');
    
    // Format the data as a TypeScript export
    const fileContent = `export default ${JSON.stringify(data, null, 2)} as const;`;
    
    await fs.promises.writeFile(filePath, fileContent, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    return false;
  }
};
