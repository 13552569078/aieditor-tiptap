import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
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
    <div className="ai-editor">
      {/* Demo 工具栏 */}
      <EditorDemoToolbar editor={editor} />

      {/* AI 工具栏 */}
      <div className="ai-editor-toolbar">
        <ConfigurableToolbar editor={editor} />
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