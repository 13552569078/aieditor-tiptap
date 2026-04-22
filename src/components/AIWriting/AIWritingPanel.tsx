import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Input, Button, Modal, Space } from '@arco-design/web-react';
import { marked } from 'marked';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import './AIWritingPanel.css';

interface AIWritingPanelProps {
  editor: Editor | null;
  visible: boolean;
  onClose: () => void;
  apiKey: string;
}

type WritingType = 'article' | 'summary' | 'outline' | 'custom';

const WRITING_TYPES = [
  { type: 'article' as const, label: '文章写作', icon: '📝', prompt: '请根据以下主题写一篇结构清晰、内容丰富的文章：\n\n' },
  { type: 'summary' as const, label: '内容摘要', icon: '📋', prompt: '请为以下内容生成一个简洁的摘要：\n\n' },
  { type: 'outline' as const, label: '文章大纲', icon: '📋', prompt: '请为以下主题生成一个详细的文章大纲：\n\n' },
];

export function AIWritingPanel({
  editor,
  visible,
  onClose,
  apiKey,
}: AIWritingPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [writingType, setWritingType] = useState<WritingType>('article');
  const [isWriting, setIsWriting] = useState(false);
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>('');

  const { isLoading, sendMessage, abort } = useDeepSeek({ apiKey });

  useEffect(() => {
    setIsWriting(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (!visible) {
      setPrompt('');
      setCustomPrompt('');
      setOutput('');
      lastHtmlRef.current = '';
      setWritingType('article');
    }
  }, [visible]);

  // 将 Markdown 转换为 HTML 并插入编辑器
  const insertMarkdownAsHtml = useCallback(
    (markdown: string, insertAtCursor: boolean = true) => {
      if (!editor) return;
      const html = marked(markdown) as string;
      if (insertAtCursor) {
        editor.chain().focus().insertContent(html).run();
      } else {
        editor.chain().focus().insertContent('<p></p>').run();
        editor.chain().insertContent(html).run();
      }
    },
    [editor]
  );

  // 流式插入到编辑器
  const streamToEditor = useCallback(
    async (fullPrompt: string) => {
      if (!editor) return;
      setOutput('');
      lastHtmlRef.current = '';

      // 先插入一个空的段落作为占位符
      editor.chain().focus().insertContent('<p></p>').run();
      const startPos = editor.state.selection.from;

      try {
        await sendMessage(
          [
            {
              role: 'user',
              content:
                fullPrompt +
                '\n\n请用 Markdown 格式输出，内容直接输出，不要有额外的解释或前缀。',
            },
          ],
          (chunk) => {
            setOutput((prev) => prev + chunk);
            const newOutput = lastHtmlRef.current + chunk;
            lastHtmlRef.current = newOutput;
            const html = marked(newOutput) as string;
            // 替换占位符内容
            editor
              .chain()
              .focus()
              .deleteRange({ from: startPos - 1, to: editor.state.selection.from })
              .insertContent(html)
              .run();
          }
        );
      } catch (err) {
        console.error('AI写作失败:', err);
      }
    },
    [editor, sendMessage]
  );

  const handleWrite = useCallback(async () => {
    if (!editor || !prompt.trim()) return;

    const selectedType = WRITING_TYPES.find((t) => t.type === writingType);
    const systemPrompt = selectedType?.prompt || customPrompt;

    if (writingType === 'custom' && !customPrompt.trim()) {
      alert('请输入自定义提示词');
      return;
    }

    const fullPrompt = writingType === 'custom' ? customPrompt + prompt : systemPrompt + prompt;

    await streamToEditor(fullPrompt);
    onClose();
  }, [editor, prompt, customPrompt, writingType, streamToEditor, onClose]);

  const handleInsertPreview = useCallback(() => {
    insertMarkdownAsHtml(output, true);
    handleCancel();
    onClose();
  }, [output, insertMarkdownAsHtml, onClose]);

  const handleAppendPreview = useCallback(() => {
    insertMarkdownAsHtml(output, false);
    handleCancel();
    onClose();
  }, [output, insertMarkdownAsHtml, onClose]);

  const handleCancel = useCallback(() => {
    if (isWriting) {
      abort();
    }
    setPrompt('');
    setCustomPrompt('');
    setOutput('');
    lastHtmlRef.current = '';
    setWritingType('article');
  }, [isWriting, abort]);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="AI 智能写作"
      footer={null}
      autoFocus={false}
      focusLock
      style={{ width: 600 }}
    >
      <div className="ai-writing-panel">
        <div className="writing-type-selector">
          <span className="writing-type-label">写作类型：</span>
          <Space>
            {WRITING_TYPES.map((type) => (
              <Button
                key={type.type}
                size="small"
                type={writingType === type.type ? 'primary' : 'secondary'}
                onClick={() => setWritingType(type.type as WritingType)}
              >
                {type.icon} {type.label}
              </Button>
            ))}
            <Button
              size="small"
              type={writingType === 'custom' ? 'primary' : 'secondary'}
              onClick={() => setWritingType('custom')}
            >
              ⚙️ 自定义
            </Button>
          </Space>
        </div>

        {writingType === 'custom' && (
          <div className="custom-prompt-input">
            <Input
              placeholder="输入自定义提示词，例如: 写一首关于春天的诗"
              value={customPrompt}
              onChange={(value) => setCustomPrompt(value)}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div className="prompt-input">
          <Input.Search
            placeholder="输入主题或内容要求，例如: 人工智能的发展历史"
            value={prompt}
            onChange={(value) => setPrompt(value)}
            onSearch={handleWrite}
            loading={isWriting}
            style={{ width: '100%' }}
            searchButton="🚀 流式插入编辑器"
          />
        </div>

        <div className="insert-mode-hint">
          点击按钮将直接流式输出到编辑器中，支持 Markdown 格式渲染
        </div>

        {isWriting && (
          <div className="writing-output" ref={outputRef}>
            <div className="output-label">🤖 正在流式生成...</div>
            <div className="output-loading">
              <span className="loading-spinner" />
              AI 写作中，请稍候...
            </div>
          </div>
        )}

        {output && !isWriting && (
          <>
            <div className="writing-output" ref={outputRef}>
              <div className="output-label">AI 输出（预览）</div>
              <div
                className="output-content"
                dangerouslySetInnerHTML={{ __html: marked(output) as string }}
              />
            </div>
            <div className="writing-actions">
              <Button type="primary" onClick={handleInsertPreview}>
                插入当前位置
              </Button>
              <Button onClick={handleAppendPreview}>追加到末尾</Button>
              <Button onClick={handleCancel}>取消</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}