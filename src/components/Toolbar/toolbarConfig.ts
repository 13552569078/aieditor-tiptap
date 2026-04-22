import { ReactNode } from 'react';
import { Editor } from '@tiptap/react';

export interface ToolbarItem {
  id: string;
  type: 'button' | 'divider' | 'group';
  icon?: ReactNode;
  label?: string;
  action?: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  children?: ToolbarItem[];
  disabled?: (editor: Editor) => boolean;
}

export const DEFAULT_TOOLBAR_CONFIG: ToolbarItem[] = [
  {
    id: 'undo',
    type: 'button',
    label: '撤销',
    icon: '↶',
    action: (editor) => editor.chain().focus().undo().run(),
    disabled: (editor) => !editor.can().undo(),
  },
  {
    id: 'redo',
    type: 'button',
    label: '重做',
    icon: '↷',
    action: (editor) => editor.chain().focus().redo().run(),
    disabled: (editor) => !editor.can().redo(),
  },
  { id: 'divider1', type: 'divider' },
  {
    id: 'bold',
    type: 'button',
    label: '加粗',
    icon: 'B',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  {
    id: 'italic',
    type: 'button',
    label: '斜体',
    icon: 'I',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  {
    id: 'underline',
    type: 'button',
    label: '下划线',
    icon: 'U',
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
  },
  {
    id: 'strike',
    type: 'button',
    label: '删除线',
    icon: 'S',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
  },
  { id: 'divider2', type: 'divider' },
  {
    id: 'heading',
    type: 'group',
    label: '标题',
    icon: 'H',
    children: [
      {
        id: 'heading1',
        type: 'button',
        label: '标题1',
        action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
      },
      {
        id: 'heading2',
        type: 'button',
        label: '标题2',
        action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
      },
      {
        id: 'heading3',
        type: 'button',
        label: '标题3',
        action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
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
    icon: '•',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    id: 'orderedList',
    type: 'button',
    label: '有序列表',
    icon: '1.',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  { id: 'divider4', type: 'divider' },
  {
    id: 'blockquote',
    type: 'button',
    label: '引用',
    icon: '❝',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    id: 'codeBlock',
    type: 'button',
    label: '代码块',
    icon: '<>',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  {
    id: 'horizontalRule',
    type: 'button',
    label: '分割线',
    icon: '—',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  { id: 'divider5', type: 'divider' },
  {
    id: 'link',
    type: 'button',
    label: '链接',
    icon: '🔗',
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
    id: 'image',
    type: 'button',
    label: '图片',
    icon: '🖼',
    action: (editor) => {
      const url = window.prompt('图片 URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
];