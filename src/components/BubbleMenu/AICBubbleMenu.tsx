import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button, Input, Tooltip } from '@arco-design/web-react';
import { useAIRewrite } from '../../hooks/useDeepSeek';
import './AICBubbleMenu.css';

interface AICBubbleMenuProps {
  editor: Editor;
  apiKey: string;
}

type AIFunctionType = 'polish' | 'expand' | 'shorten' | 'grammar' | 'custom';

const AI_FUNCTIONS = [
  { type: 'polish' as const, label: '润色', icon: '✨' },
  { type: 'expand' as const, label: '扩写', icon: '📝' },
  { type: 'shorten' as const, label: '缩写', icon: '✂️' },
  { type: 'grammar' as const, label: '语法检查', icon: '🔍' },
];

export function AICBubbleMenu({ editor, apiKey }: AICBubbleMenuProps) {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');

  const { isRewriting, result, rewrite, abort } = useAIRewrite(apiKey);

  useEffect(() => {
    if (result) {
      setAiOutput(result);
    }
  }, [result]);

  const getSelection = useCallback(() => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    return text;
  }, [editor]);

  const handleCopy = useCallback(() => {
    const text = getSelection();
    navigator.clipboard.writeText(text);
  }, [getSelection]);

  const handleAIRewrite = useCallback(
    (type: AIFunctionType) => {
      const text = getSelection();
      if (!text.trim()) return;

      setAiOutput('');

      if (type === 'custom') {
        if (!customPrompt.trim()) {
          alert('请输入自定义提示词');
          return;
        }
        rewrite(text, 'custom', customPrompt);
      } else {
        rewrite(text, type);
      }

      setShowAIPanel(true);
    },
    [getSelection, customPrompt, rewrite]
  );

  const handleReplace = useCallback(() => {
    if (!result) return;

    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContent(result).run();
    setShowAIPanel(false);
    setAiOutput('');
  }, [editor, result]);

  const handleInsert = useCallback(() => {
    if (!result) return;

    editor.chain().focus().insertContent(result).run();
    setShowAIPanel(false);
    setAiOutput('');
  }, [editor, result]);

  const handleCancel = useCallback(() => {
    if (isRewriting) {
      abort();
    }
    setShowAIPanel(false);
    setAiOutput('');
    setCustomPrompt('');
  }, [isRewriting, abort]);

  return (
    <BubbleMenu editor={editor}>
      <div className="ai-bubble-menu">
        <Tooltip content="复制">
          <button className="bubble-btn" onClick={handleCopy}>
            📋
          </button>
        </Tooltip>
        <div className="bubble-divider" />
        <Tooltip content="AI 智能改写">
          <button className="bubble-btn" onClick={() => setShowAIPanel(!showAIPanel)}>
            🤖
          </button>
        </Tooltip>
      </div>

      {showAIPanel && (
        <div className="ai-panel" style={{ top: '50px', left: '0' }}>
          <div className="ai-panel-header">
            <span className="ai-panel-title">AI 智能改写</span>
            <button className="ai-panel-close" onClick={handleCancel}>
              ✕
            </button>
          </div>

          <div className="ai-panel-actions">
            {AI_FUNCTIONS.map((func) => (
              <button
                key={func.type}
                className="ai-action-btn"
                onClick={() => handleAIRewrite(func.type)}
                disabled={isRewriting}
              >
                {func.icon} {func.label}
              </button>
            ))}
          </div>

          <div className="ai-panel-input-group">
            <Input
              placeholder="自定义提示词，例如: 改为更正式的语气"
              value={customPrompt}
              onChange={(value) => setCustomPrompt(value)}
              onPressEnter={() => handleAIRewrite('custom')}
              style={{ marginBottom: 8 }}
            />
          </div>

          {(isRewriting || aiOutput) && (
            <div className="ai-output">
              <div className="ai-output-label">AI 输出</div>
              {isRewriting && (
                <div className="ai-output-loading">
                  <span className="loading-spinner" />
                  AI 正在改写中...
                </div>
              )}
              {aiOutput && <div className="ai-output-content">{aiOutput}</div>}
            </div>
          )}

          {aiOutput && !isRewriting && (
            <div className="ai-panel-buttons">
              <Button type="primary" size="small" onClick={handleReplace}>
                替换
              </Button>
              <Button size="small" onClick={handleInsert}>
                插入
              </Button>
              <Button size="small" status="default" onClick={handleCancel}>
                取消
              </Button>
            </div>
          )}
        </div>
      )}
    </BubbleMenu>
  );
}