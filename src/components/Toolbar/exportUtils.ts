import html2pdf from 'html2pdf.js';
import { Editor } from '@tiptap/react';

const getBasicStyles = () => `
  body { font-family: 'Times New Roman', serif; line-height: 1.8; font-size: 12pt; }
  h1 { font-size: 22pt; font-weight: bold; margin: 24pt 0 12pt; }
  h2 { font-size: 18pt; font-weight: bold; margin: 20pt 0 10pt; }
  h3 { font-size: 16pt; font-weight: bold; margin: 16pt 0 8pt; }
  h4 { font-size: 14pt; font-weight: bold; margin: 12pt 0 6pt; }
  p { margin: 12pt 0; text-indent: 24pt; }
  ul, ol { margin: 12pt 0; padding-left: 36pt; }
  li { margin: 6pt 0; }
  blockquote { margin: 12pt 0; padding-left: 18pt; border-left: 3pt solid #666; font-style: italic; }
  pre { background: #f5f5f5; padding: 12pt; margin: 12pt 0; font-family: 'Consolas', monospace; font-size: 10pt; }
  code { background: #f0f0f0; padding: 2pt 6pt; font-family: 'Consolas', monospace; }
  table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
  th, td { border: 1pt solid #666; padding: 8pt; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  img { max-width: 100%; height: auto; }
  a { color: #0066cc; }
`;

export const exportToPDF = (editor: Editor, fileName = 'document') => {
  const editorContent = editor.getHTML();

  const container = document.createElement('div');
  container.innerHTML = editorContent;

  const style = document.createElement('style');
  style.textContent = `
    ${getBasicStyles()}
    body { padding: 20mm; }
    p { text-indent: 2em; margin: 1em 0; }
    ul, ol { padding-left: 2em; }
    li { margin: 0.5em 0; }
    blockquote { border-left: 3px solid #333; padding-left: 1em; color: #555; }
    pre { background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #999; padding: 8px 12px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
    img { max-width: 100%; }
    h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 16px; }
  `;

  container.prepend(style);
  document.body.appendChild(container);

  const opt = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename: `${fileName}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  html2pdf().set(opt).from(container).save().finally(() => {
    document.body.removeChild(container);
  });
};

export const exportToWord = (editor: Editor, fileName = 'document') => {
  const editorContent = editor.getHTML();

  // 使用更兼容的 HTML 到 Word 转换
  const fullHTML = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style type="text/css">
    @page {
      margin: 2.5cm 2cm 2cm 2cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 200%;
      text-indent: 0.5cm;
    }
    p {
      margin: 0;
      text-indent: 0.5cm;
      line-height: 200%;
    }
    h1 {
      font-size: 22pt;
      font-weight: bold;
      margin: 12pt 0 6pt;
      text-indent: 0;
    }
    h2 {
      font-size: 18pt;
      font-weight: bold;
      margin: 10pt 0 5pt;
      text-indent: 0;
    }
    h3 {
      font-size: 16pt;
      font-weight: bold;
      margin: 8pt 0 4pt;
      text-indent: 0;
    }
    h4 {
      font-size: 14pt;
      font-weight: bold;
      margin: 6pt 0 3pt;
      text-indent: 0;
    }
    ul, ol {
      margin: 6pt 0 6pt 36pt;
    }
    li {
      margin: 3pt 0;
    }
    blockquote {
      margin: 6pt 0;
      padding-left: 18pt;
      border-left: 3pt solid #666;
      font-style: italic;
    }
    pre, code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 10pt;
      background: #f5f5f5;
    }
    pre {
      padding: 12pt;
      margin: 12pt 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
    }
    th, td {
      border: 1pt solid #666;
      padding: 6pt 8pt;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0066cc;
    }
  </style>
</head>
<body>
${editorContent}
</body>
</html>`;

  // 使用 Blob 创建兼容的 Word 文档
  const blob = new Blob(['﻿' + fullHTML], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToHTML = (editor: Editor, fileName = 'document') => {
  const editorContent = editor.getHTML();

  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    ${getBasicStyles()}
    body { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    p { text-indent: 2em; }
  </style>
</head>
<body>
  ${editorContent}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (editor: Editor, fileName = 'document') => {
  const html = editor.getHTML();

  // HTML 转 Markdown
  let markdown = html
    // 标题 - 需要先处理
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n\n')
    // 粗体斜体
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    // 代码
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    // 链接图片
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![image]($1)')
    // 引用
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    // 分割线
    .replace(/<hr[^>]*>/gi, '\n---\n')
    // 段落
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    // 列表
    .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // 清理标签
    .replace(/<[^>]+>/g, '')
    // HTML 实体
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    // 清理多余空白
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};