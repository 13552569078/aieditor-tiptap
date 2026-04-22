import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Input, Switch, Button, Space, Modal, Tooltip } from '@arco-design/web-react';
import './SearchReplacePanel.css';

interface SearchReplacePanelProps {
  editor: Editor | null;
  visible: boolean;
  onClose: () => void;
}

export function SearchReplacePanel({ editor, visible, onClose }: SearchReplacePanelProps) {
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const highlightRefs = useRef<{ from: number; to: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const clearHighlight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
    setIsSearching(false);
    setMatchCount(0);
    highlightRefs.current = [];
  }, [editor]);

  useEffect(() => {
    if (!visible) {
      clearHighlight();
      setSearchText('');
      setReplaceText('');
    }
  }, [visible, clearHighlight]);

  const handleSearch = useCallback(() => {
    if (!editor || !searchText.trim()) return;

    clearHighlight();

    let pattern = searchText;
    if (wholeWord) {
      pattern = `\\b${escapeRegExp(pattern)}\\b`;
    }
    const flags = caseSensitive ? 'g' : 'gi';

    const results: { from: number; to: number }[] = [];
    const doc = editor.state.doc;

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match;
        const tempRegex = new RegExp(pattern, flags);
        while ((match = tempRegex.exec(node.text)) !== null) {
          const from = pos + match.index;
          const to = from + match[0].length;
          results.push({ from, to });

          const tr = editor.state.tr;
          tr.addMark(from, to, editor.schema.marks.highlight.create({ color: '#f59e0b' }));
          editor.view.dispatch(tr);
        }
      }
    });

    highlightRefs.current = results;
    setMatchCount(results.length);
    setCurrentIndex(0);

    if (results.length === 0) {
      return;
    }

    setIsSearching(true);

    if (results.length > 0) {
      editor.commands.setTextSelection({
        from: results[0].from,
        to: results[0].to,
      });
      editor.commands.scrollIntoView();
    }
  }, [editor, searchText, caseSensitive, wholeWord, clearHighlight]);

  const handleReplace = useCallback(() => {
    if (!editor || !searchText.trim() || !replaceText) return;

    let pattern = searchText;
    if (wholeWord) {
      pattern = `\\b${escapeRegExp(pattern)}\\b`;
    }
    const flags = caseSensitive ? 'g' : 'gi';
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags);
    } catch {
      re = new RegExp(escapeRegExp(searchText), flags);
    }

    const content = editor.getHTML();
    const newContent = content.replace(re, replaceText);

    editor.commands.setContent(newContent);
    clearHighlight();
    setMatchCount(0);
  }, [editor, searchText, replaceText, caseSensitive, wholeWord, clearHighlight]);

  const handleReplaceCurrent = useCallback(() => {
    if (!editor || highlightRefs.current.length === 0) return;

    const current = highlightRefs.current[currentIndex];
    editor
      .chain()
      .focus()
      .deleteRange({ from: current.from, to: current.to })
      .insertContent(replaceText)
      .run();

    handleSearch();
  }, [editor, currentIndex, replaceText, handleSearch]);

  const handleClear = useCallback(() => {
    clearHighlight();
    setSearchText('');
    setReplaceText('');
    setMatchCount(0);
  }, [clearHighlight]);

  const handleNext = useCallback(() => {
    if (!editor || highlightRefs.current.length === 0) return;

    const nextIndex = (currentIndex + 1) % highlightRefs.current.length;
    setCurrentIndex(nextIndex);

    const current = highlightRefs.current[nextIndex];
    editor.commands.setTextSelection({
      from: current.from,
      to: current.to,
    });
    editor.commands.scrollIntoView();
  }, [editor, currentIndex]);

  const handlePrev = useCallback(() => {
    if (!editor || highlightRefs.current.length === 0) return;

    const prevIndex = (currentIndex - 1 + highlightRefs.current.length) % highlightRefs.current.length;
    setCurrentIndex(prevIndex);

    const current = highlightRefs.current[prevIndex];
    editor.commands.setTextSelection({
      from: current.from,
      to: current.to,
    });
    editor.commands.scrollIntoView();
  }, [editor, currentIndex]);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="批量查找替换"
      footer={null}
      autoFocus={false}
      focusLock
    >
      <div className="search-replace-content">
        <div className="search-replace-input-group">
          <label className="search-replace-label">搜索内容</label>
          <Input.Search
            placeholder="输入要搜索的关键词"
            value={searchText}
            onChange={(value) => setSearchText(value)}
            onPressEnter={handleSearch}
            style={{ width: '100%' }}
          />
        </div>

        <div className="search-replace-input-group">
          <label className="search-replace-label">替换为</label>
          <Input
            placeholder="输入替换内容"
            value={replaceText}
            onChange={(value) => setReplaceText(value)}
            onPressEnter={handleReplace}
            style={{ width: '100%' }}
          />
        </div>

        <div className="search-replace-options">
          <Space>
            <Switch checked={caseSensitive} onChange={setCaseSensitive} />
            <span>区分大小写</span>
            <Switch checked={wholeWord} onChange={setWholeWord} />
            <span>全字匹配</span>
          </Space>
        </div>

        {isSearching && matchCount > 0 && (
          <div className="search-replace-count">
            找到 {matchCount} 个匹配，当前 {currentIndex + 1}/{matchCount}
          </div>
        )}

        <div className="search-replace-buttons">
          <Space>
            <Button type="primary" onClick={handleSearch} disabled={!searchText.trim()}>
              一键筛选
            </Button>
            <Button onClick={handleReplace} disabled={!searchText.trim() || !replaceText}>
              一键替换
            </Button>
            <Button onClick={handleReplaceCurrent} disabled={!isSearching || matchCount === 0}>
              替换当前
            </Button>
            <Tooltip content="上一个">
              <Button icon="◀" onClick={handlePrev} disabled={!isSearching || matchCount === 0} />
            </Tooltip>
            <Tooltip content="下一个">
              <Button icon="▶" onClick={handleNext} disabled={!isSearching || matchCount === 0} />
            </Tooltip>
            <Button onClick={handleClear}>清除</Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}