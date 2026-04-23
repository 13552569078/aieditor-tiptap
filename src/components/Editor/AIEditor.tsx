import { useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle, Color, FontFamily } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { ConfigurableToolbar } from '../Toolbar/ConfigurableToolbar';
import { AICBubbleMenu } from '../BubbleMenu/AICBubbleMenu';
import { SearchReplacePanel } from '../SearchReplace/SearchReplacePanel';
import { AIWritingPanel } from '../AIWriting/AIWritingPanel';
import { EditorDemoToolbar } from './EditorDemoToolbar';
import { Button, Tooltip } from '@arco-design/web-react';
import './AIEditor.css';

const API_KEY = 'sk-bc24473cc2104ba9a0c28e40bc992feb';

export function AIEditor() {
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [showAIWriting, setShowAIWriting] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: '开始输入内容...',
      }),
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Subscript,
      Superscript,
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  const handleSearchReplace = useCallback(() => {
    setShowSearchReplace(true);
  }, []);

  const handleAIWriting = useCallback(() => {
    setShowAIWriting(true);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="ai-editor" ref={editorContainerRef}>
      {/* Demo 工具栏 */}
      <EditorDemoToolbar editor={editor} />

      {/* AI 工具栏 */}
      <div className="ai-editor-toolbar">
        <ConfigurableToolbar editor={editor} editorRef={editorContainerRef} />
        <div className="ai-editor-toolbar-right">
          <Tooltip content="AI 写作">
            <Button
              icon="✍️"
              size="small"
              onClick={handleAIWriting}
            />
          </Tooltip>
          <Tooltip content="查找替换">
            <Button
              icon="🔍"
              size="small"
              onClick={handleSearchReplace}
            />
          </Tooltip>
        </div>
      </div>

      <div className="ai-editor-container">
        <AICBubbleMenu editor={editor} apiKey={API_KEY} />
        <EditorContent editor={editor} />
      </div>

      <SearchReplacePanel
        editor={editor}
        visible={showSearchReplace}
        onClose={() => setShowSearchReplace(false)}
      />

      <AIWritingPanel
        editor={editor}
        visible={showAIWriting}
        onClose={() => setShowAIWriting(false)}
        apiKey={API_KEY}
      />
    </div>
  );
}