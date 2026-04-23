import { Editor } from '@tiptap/react';
import { Tooltip, Dropdown, Menu } from '@arco-design/web-react';
import { ToolbarItem, DEFAULT_TOOLBAR_CONFIG } from './toolbarConfig';
import './ConfigurableToolbar.css';
import { RefObject } from 'react';

interface ConfigurableToolbarProps {
  editor: Editor | null;
  config?: ToolbarItem[];
  editorRef?: RefObject<HTMLDivElement>;
}

export function ConfigurableToolbar({ editor, config = DEFAULT_TOOLBAR_CONFIG, editorRef }: ConfigurableToolbarProps) {
  if (!editor) {
    return null;
  }

  const handleClick = (item: ToolbarItem) => {
    if (item.action) {
      item.action(editor, editorRef);
    }
  };

  const isItemActive = (item: ToolbarItem) => {
    return item.isActive ? item.isActive(editor) : false;
  };

  const isItemDisabled = (item: ToolbarItem) => {
    return item.disabled ? item.disabled(editor) : false;
  };

  const renderButton = (item: ToolbarItem) => {
    const active = isItemActive(item);
    const disabled = isItemDisabled(item);

    return (
      <Tooltip key={item.id} content={item.label}>
        <button
          className={`toolbar-button ${active ? 'active' : ''}`}
          onClick={() => handleClick(item)}
          disabled={disabled}
        >
          <span className="toolbar-icon">{item.icon}</span>
        </button>
      </Tooltip>
    );
  };

  const renderDivider = () => {
    return <div key={`div-${Math.random()}`} className="toolbar-divider" />;
  };

  const renderGroup = (item: ToolbarItem) => {
    if (!item.children || item.children.length === 0) return null;

    return (
      <Dropdown
        key={item.id}
        droplist={
          <Menu onClickMenuItem={(key) => {
            const child = item.children?.find((c) => c.id === key);
            if (child?.action) {
              child.action(editor, editorRef);
            }
          }}>
            {item.children.map((child) => (
              <Menu.Item key={child.id} className={isItemActive(child) ? 'arco-menu-item-selected' : ''}>
                {child.label}
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger="click"
        position="br"
      >
        <button className={`toolbar-button toolbar-group-button ${item.children.some(isItemActive) ? 'active' : ''}`}>
          <span className="toolbar-icon">{item.icon}</span>
          <span className="toolbar-caret">▼</span>
        </button>
      </Dropdown>
    );
  };

  const renderItem = (item: ToolbarItem) => {
    switch (item.type) {
      case 'divider':
        return renderDivider();
      case 'group':
        return renderGroup(item);
      default:
        return renderButton(item);
    }
  };

  return (
    <div className="configurable-toolbar">
      {config.map(renderItem)}
    </div>
  );
}