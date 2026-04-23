import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript,
  Subscript,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Table,
  Maximize2,
  Unlink,
  FileCode,
  ListTodo,
  Trash2,
  Palette,
  FileText,
  Columns,
  Copy,
  Scissors,
  Clipboard,
  Type,
  Sparkles,
  FileDown,
  FileJson,
  Download,
} from 'lucide-react';

export interface ToolbarItem {
  id: string;
  type: 'button' | 'divider' | 'group';
  icon?: React.ReactNode;
  label?: string;
  action?: (editor: Editor, editorRef?: React.RefObject<HTMLDivElement>) => void;
  isActive?: (editor: Editor) => boolean;
  children?: ToolbarItem[];
  disabled?: (editor: Editor) => boolean;
  title?: string;
}

export const DEFAULT_TOOLBAR_CONFIG: ToolbarItem[] = [
  {
    id: 'undo',
    type: 'button',
    label: '撤销',
    icon: <Undo2 size={18} />,
    title: '撤销 (Ctrl+Z)',
    action: (editor) => editor.chain().focus().undo().run(),
    disabled: (editor) => !editor.can().undo(),
  },
  {
    id: 'redo',
    type: 'button',
    label: '重做',
    icon: <Redo2 size={18} />,
    title: '重做 (Ctrl+Y)',
    action: (editor) => editor.chain().focus().redo().run(),
    disabled: (editor) => !editor.can().redo(),
  },
  { id: 'divider0', type: 'divider' },
  {
    id: 'bold',
    type: 'button',
    label: '加粗',
    icon: <Bold size={18} />,
    title: '加粗 (Ctrl+B)',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  {
    id: 'italic',
    type: 'button',
    label: '斜体',
    icon: <Italic size={18} />,
    title: '斜体 (Ctrl+I)',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  {
    id: 'underline',
    type: 'button',
    label: '下划线',
    icon: <Underline size={18} />,
    title: '下划线 (Ctrl+U)',
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
  },
  {
    id: 'strike',
    type: 'button',
    label: '删除线',
    icon: <Strikethrough size={18} />,
    title: '删除线',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
  },
  {
    id: 'code',
    type: 'button',
    label: '行内代码',
    icon: <FileCode size={18} />,
    title: '行内代码',
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive('code'),
  },
  {
    id: 'highlight',
    type: 'button',
    label: '高亮',
    icon: <Highlighter size={18} />,
    title: '高亮',
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
    isActive: (editor) => editor.isActive('highlight'),
  },
  {
    id: 'superscript',
    type: 'button',
    label: '上标',
    icon: <Superscript size={18} />,
    title: '上标',
    action: (editor) => editor.chain().focus().toggleSuperscript().run(),
    isActive: (editor) => editor.isActive('superscript'),
  },
  {
    id: 'subscript',
    type: 'button',
    label: '下标',
    icon: <Subscript size={18} />,
    title: '下标',
    action: (editor) => editor.chain().focus().toggleSubscript().run(),
    isActive: (editor) => editor.isActive('subscript'),
  },
  { id: 'divider1', type: 'divider' },
  {
    id: 'align',
    type: 'group',
    label: '对齐',
    icon: <AlignLeft size={18} />,
    children: [
      {
        id: 'alignLeft',
        type: 'button',
        label: '左对齐',
        icon: <AlignLeft size={18} />,
        action: (editor) => editor.chain().focus().setTextAlign('left').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'left' }),
      },
      {
        id: 'alignCenter',
        type: 'button',
        label: '居中',
        icon: <AlignCenter size={18} />,
        action: (editor) => editor.chain().focus().setTextAlign('center').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'center' }),
      },
      {
        id: 'alignRight',
        type: 'button',
        label: '右对齐',
        icon: <AlignRight size={18} />,
        action: (editor) => editor.chain().focus().setTextAlign('right').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'right' }),
      },
      {
        id: 'alignJustify',
        type: 'button',
        label: '两端对齐',
        icon: <AlignJustify size={18} />,
        action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
        isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
      },
    ],
  },
  { id: 'divider2', type: 'divider' },
  {
    id: 'heading',
    type: 'group',
    label: '标题',
    icon: <Heading1 size={18} />,
    children: [
      {
        id: 'heading1',
        type: 'button',
        label: '标题1',
        icon: <Heading1 size={18} />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
      },
      {
        id: 'heading2',
        type: 'button',
        label: '标题2',
        icon: <Heading2 size={18} />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
      },
      {
        id: 'heading3',
        type: 'button',
        label: '标题3',
        icon: <Heading3 size={18} />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
      },
      {
        id: 'heading4',
        type: 'button',
        label: '标题4',
        icon: <Heading4 size={18} />,
        action: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 4 }),
      },
      {
        id: 'paragraph',
        type: 'button',
        label: '正文',
        action: (editor) => editor.chain().focus().setParagraph().run(),
        isActive: (editor) => editor.isActive('paragraph'),
      },
    ],
  },
  { id: 'divider3', type: 'divider' },
  {
    id: 'bulletList',
    type: 'button',
    label: '无序列表',
    icon: <List size={18} />,
    title: '无序列表',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    id: 'orderedList',
    type: 'button',
    label: '有序列表',
    icon: <ListOrdered size={18} />,
    title: '有序列表',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    id: 'taskList',
    type: 'button',
    label: '任务列表',
    icon: <ListTodo size={18} />,
    title: '任务列表',
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
  },
  {
    id: 'indent',
    type: 'button',
    label: '增加缩进',
    icon: <IndentIncrease size={18} />,
    title: '增加缩进',
    action: (editor) => editor.chain().focus().sinkListItem('listItem').run(),
  },
  {
    id: 'outdent',
    type: 'button',
    label: '减少缩进',
    icon: <IndentDecrease size={18} />,
    title: '减少缩进',
    action: (editor) => editor.chain().focus().liftListItem('listItem').run(),
  },
  { id: 'divider4', type: 'divider' },
  {
    id: 'blockquote',
    type: 'button',
    label: '引用',
    icon: <Quote size={18} />,
    title: '引用',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    id: 'codeBlock',
    type: 'button',
    label: '代码块',
    icon: <Code2 size={18} />,
    title: '代码块',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  {
    id: 'horizontalRule',
    type: 'button',
    label: '分割线',
    icon: <Minus size={18} />,
    title: '分割线',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  { id: 'divider5', type: 'divider' },
  {
    id: 'link',
    type: 'button',
    label: '链接',
    icon: <Link size={18} />,
    title: '插入链接',
    action: (editor) => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);
      if (url === null) return;
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    },
    isActive: (editor) => editor.isActive('link'),
  },
  {
    id: 'unlink',
    type: 'button',
    label: '取消链接',
    icon: <Unlink size={18} />,
    title: '取消链接',
    action: (editor) => editor.chain().focus().unsetLink().run(),
    disabled: (editor) => !editor.isActive('link'),
  },
  {
    id: 'image',
    type: 'button',
    label: '图片',
    icon: <Image size={18} />,
    title: '插入图片',
    action: (editor) => {
      const url = window.prompt('图片 URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    id: 'table',
    type: 'group',
    label: '表格',
    icon: <Table size={18} />,
    children: [
      {
        id: 'table3x3',
        type: 'button',
        label: '3x3 表格',
        action: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      {
        id: 'table4x4',
        type: 'button',
        label: '4x4 表格',
        action: (editor) => editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run(),
      },
      {
        id: 'table5x5',
        type: 'button',
        label: '5x5 表格',
        action: (editor) => editor.chain().focus().insertTable({ rows: 5, cols: 5, withHeaderRow: true }).run(),
      },
      {
        id: 'table2x3',
        type: 'button',
        label: '2x3 表格',
        action: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run(),
      },
      {
        id: 'table2x4',
        type: 'button',
        label: '2x4 表格',
        action: (editor) => editor.chain().focus().insertTable({ rows: 4, cols: 2, withHeaderRow: true }).run(),
      },
    ],
  },
  { id: 'divider6', type: 'divider' },
  {
    id: 'clearFormat',
    type: 'button',
    label: '清除格式',
    icon: <Trash2 size={18} />,
    title: '清除所有格式',
    action: (editor) => {
      editor.chain()
        .focus()
        .clearNodes()
        .unsetAllMarks()
        .unsetFontFamily()
        .setFontSize('')
        .setColor('')
        .run();
    },
  },
  { id: 'divider7', type: 'divider' },
  {
    id: 'fontFamily',
    type: 'group',
    label: '字体',
    icon: <Type size={18} />,
    children: [
      {
        id: 'fontSans',
        type: 'button',
        label: '无衬线',
        action: (editor) => editor.chain().focus().setFontFamily('sans-serif').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontFamily === 'sans-serif',
      },
      {
        id: 'fontSerif',
        type: 'button',
        label: '衬线',
        action: (editor) => editor.chain().focus().setFontFamily('serif').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontFamily === 'serif',
      },
      {
        id: 'fontMono',
        type: 'button',
        label: '等宽',
        action: (editor) => editor.chain().focus().setFontFamily('monospace').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontFamily === 'monospace',
      },
    ],
  },
  {
    id: 'fontSize',
    type: 'group',
    label: '字号',
    icon: <Sparkles size={18} />,
    children: [
      {
        id: 'fontSize12',
        type: 'button',
        label: '12px',
        action: (editor) => editor.chain().focus().setFontSize('12px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '12px',
      },
      {
        id: 'fontSize14',
        type: 'button',
        label: '14px',
        action: (editor) => editor.chain().focus().setFontSize('14px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '14px',
      },
      {
        id: 'fontSize16',
        type: 'button',
        label: '16px',
        action: (editor) => editor.chain().focus().setFontSize('16px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '16px',
      },
      {
        id: 'fontSize18',
        type: 'button',
        label: '18px',
        action: (editor) => editor.chain().focus().setFontSize('18px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '18px',
      },
      {
        id: 'fontSize20',
        type: 'button',
        label: '20px',
        action: (editor) => editor.chain().focus().setFontSize('20px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '20px',
      },
      {
        id: 'fontSize24',
        type: 'button',
        label: '24px',
        action: (editor) => editor.chain().focus().setFontSize('24px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '24px',
      },
      {
        id: 'fontSize32',
        type: 'button',
        label: '32px',
        action: (editor) => editor.chain().focus().setFontSize('32px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '32px',
      },
      {
        id: 'fontSize48',
        type: 'button',
        label: '48px',
        action: (editor) => editor.chain().focus().setFontSize('48px').run(),
        isActive: (editor) => editor.getAttributes('textStyle').fontSize === '48px',
      },
    ],
  },
  { id: 'divider8', type: 'divider' },
  {
    id: 'textColor',
    type: 'button',
    label: '文字颜色',
    icon: <Palette size={18} />,
    title: '文字颜色',
    action: (editor) => {
      const color = window.prompt('输入颜色值 (如: #ff0000 或 red)');
      if (color) {
        editor.chain().focus().setColor(color).run();
      }
    },
  },
  {
    id: 'bgColor',
    type: 'button',
    label: '背景颜色',
    icon: <Highlighter size={18} />,
    title: '背景颜色',
    action: (editor) => {
      const color = window.prompt('输入背景颜色值 (如: #ff0000 或 yellow)');
      if (color) {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
  },
  { id: 'divider9', type: 'divider' },
  {
    id: 'fullscreen',
    type: 'button',
    label: '全屏',
    icon: <Maximize2 size={18} />,
    title: '全屏',
    action: (_editor, editorRef) => {
      const container = editorRef?.current;
      if (!container) return;

      if (container.classList.contains('fullscreen')) {
        container.classList.remove('fullscreen');
      } else {
        container.classList.add('fullscreen');
      }
    },
  },
  { id: 'divider10', type: 'divider' },
  {
    id: 'cut',
    type: 'button',
    label: '剪切',
    icon: <Scissors size={18} />,
    title: '剪切 (Ctrl+X)',
    action: (editor) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text);
      editor.chain().focus().deleteSelection().run();
    },
    disabled: (editor) => editor.state.selection.empty,
  },
  {
    id: 'copy',
    type: 'button',
    label: '复制',
    icon: <Copy size={18} />,
    title: '复制 (Ctrl+C)',
    action: (editor) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text);
    },
    disabled: (editor) => editor.state.selection.empty,
  },
  {
    id: 'paste',
    type: 'button',
    label: '粘贴',
    icon: <Clipboard size={18} />,
    title: '粘贴 (Ctrl+V)',
    action: async (editor) => {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
    },
  },
  { id: 'divider11', type: 'divider' },
  {
    id: 'insertDivider',
    type: 'button',
    label: '插入分隔符',
    icon: <Columns size={18} />,
    title: '插入分隔符',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    id: 'insertPageBreak',
    type: 'button',
    label: '插入分页',
    icon: <FileText size={18} />,
    title: '插入分页符',
    action: (editor) => editor.chain().focus().setHardBreak().run(),
  },
  { id: 'divider12', type: 'divider' },
  {
    id: 'export',
    type: 'group',
    label: '导出',
    icon: <Download size={18} />,
    children: [
      {
        id: 'exportPDF',
        type: 'button',
        label: '导出 PDF',
        icon: <FileDown size={18} />,
        action: async (editor) => {
          const { exportToPDF } = await import('./exportUtils');
          exportToPDF(editor, 'document');
        },
      },
      {
        id: 'exportWord',
        type: 'button',
        label: '导出 Word',
        icon: <FileJson size={18} />,
        action: async (editor) => {
          const { exportToWord } = await import('./exportUtils');
          exportToWord(editor, 'document');
        },
      },
      {
        id: 'exportHTML',
        type: 'button',
        label: '导出 HTML',
        icon: <FileText size={18} />,
        action: async (editor) => {
          const { exportToHTML } = await import('./exportUtils');
          exportToHTML(editor, 'document');
        },
      },
      {
        id: 'exportMarkdown',
        type: 'button',
        label: '导出 Markdown',
        icon: <FileJson size={18} />,
        action: async (editor) => {
          const { exportToMarkdown } = await import('./exportUtils');
          exportToMarkdown(editor, 'document');
        },
      },
    ],
  },
];

export const createToolbarConfig = (customItems?: Partial<ToolbarItem>[]): ToolbarItem[] => {
  if (!customItems) return DEFAULT_TOOLBAR_CONFIG;

  const merged = DEFAULT_TOOLBAR_CONFIG.map((item) => {
    const custom = customItems.find((c) => c.id === item.id);
    if (custom) {
      return { ...item, ...custom };
    }
    return item;
  });

  return merged;
};