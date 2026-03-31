import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export async function getMarkdownData(subdirectory: string, filename: string): Promise<any> {
  const fullPath = path.join(contentDirectory, subdirectory, `${filename}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    filename,
    contentHtml,
    ...matterResult.data,
  };
}

export function getAllMarkdownFiles(subdirectory: string) {
  const fullPath = path.join(contentDirectory, subdirectory);
  if (!fs.existsSync(fullPath)) return [];
  const fileNames = fs.readdirSync(fullPath);
  return fileNames.filter(f => f.endsWith('.md')).map(fileName => {
    return {
      filename: fileName.replace(/\.md$/, ''),
    }
  });
}
