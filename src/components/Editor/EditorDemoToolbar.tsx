import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button, Space, Tooltip, Drawer } from '@arco-design/web-react';
import { marked } from 'marked';
import styles from './EditorDemoToolbar.module.css';

interface EditorToolbarProps {
  editor: Editor | null;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  pos: number;
}

const SAMPLE_MD = `# 综合示例

## 1. 文本格式
**粗体** *斜体* ~~删除线~~

## 2. 引用
> 这是一段引用文本

## 3. 图片
![图片描述](https://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=200&h=200)

## 4. 代码
\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

## 5. 任务列表
- [x] 已完成
- [ ] 进行中
- [ ] 待处理

## 6. 表格
| 名称 | 价格 | 数量 |
|------|------|------|
| 苹果 | ¥5   | 10   |
| 香蕉 | ¥3   | 20   |
`;

const SAMPLE_MD_WITH_TOC = `
## 一、设立背景与战略意义
2017年4月1日，中共中央、国务院正式宣布设立**河北雄安新区**，定位为**国家级新区**，被称为"**千年大计、国家大事**"。

---

## 二、地理区位与基本概况
- 地理位置：河北省中部，北京、天津、保定腹地。
- 规划面积：约**1770平方公里**。

---

## 三、发展定位与建设目标
### 核心定位
- 北京非首都功能疏解集中承载地
- 高水平社会主义现代化城市

### 建设目标
- 短期（到2035年）：基本建成绿色低碳、信息智能、宜居宜业的现代化城市。

---

## 四、空间规划与城市布局
遵循"**北城、中苑、南淀**"总体结构，形成"**一方城、两轴线、五组团**"的空间格局。

---

## 五、生态环境与白洋淀治理
- 核心生态：**白洋淀**是华北平原最大淡水湖。
- 治理目标：恢复"**华北之肾**"功能。

---

## 六、产业发展与非首都功能疏解
### 承接重点
- 央企总部、金融机构、科研院所
- 高端高新产业：**人工智能、大数据、区块链**

---

## 七、交通体系与基础设施
### 对外交通
- 高铁：京雄城际、津雄城际、京港高铁等。
- 高速：京雄高速、荣乌高速等。

---

## 八、智慧城市与数字城市建设
- 核心理念：**数字城市与现实城市同步规划、同步建设**
- 基础设施：全域部署**5G、物联网、算力中心**

---

## 九、公共服务与民生保障
- 教育：引入北京优质中小学，布局**雄安大学**
- 医疗：建设**雄安宣武医院**等高水平医疗机构

---

## 十、建设进展与阶段成果
截至2026年：
- 开发面积超**202平方公里**
- 楼宇建成投用超**5000万平方米**

---

## 十一、文化特色与城市风貌
- 设计理念：**中西合璧、以中为主、古今交融**
- 地标建筑：雄安高铁站、雄安体育中心

---

## 十二、总结与展望
雄安新区从"一张白纸"到"**未来之城**"，已成为**大规模建设与承接疏解并重**阶段。
`;

export function EditorDemoToolbar({ editor }: EditorToolbarProps) {
  const [directoryVisible, setDirectoryVisible] = useState(false);
  const [directoryList, setDirectoryList] = useState<HeadingItem[]>([]);

  // 导入简单 Markdown
  const handleImport = useCallback(() => {
    if (!editor) return;
    const html = marked(SAMPLE_MD) as string;
    editor.commands.setContent(html);
  }, [editor]);

  // 导入带目录的 Markdown
  const handleImportToc = useCallback(() => {
    if (!editor) return;
    const html = marked(SAMPLE_MD_WITH_TOC) as string;
    editor.commands.setContent(html);
  }, [editor]);

  // 点击目录项，定位到对应位置
  const handleDirectoryClick = useCallback((item: HeadingItem) => {
    if (!editor) return;

    // 只设置光标位置，不选中文字
    editor.commands.setTextSelection(item.pos);
    editor.commands.focus();

    // 使用 setTimeout 确保 DOM 更新后再滚动
    setTimeout(() => {
      // 找到对应的 DOM 元素并滚动到可视区域
      const editorElement = editor.view.dom;
      const headingElements = editorElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let targetElement: HTMLElement | null = null;

      // 根据文本内容匹配
      for (const el of headingElements) {
        if (el.textContent === item.text) {
          targetElement = el as HTMLElement;
          break;
        }
      }

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // 回退：滚动到编辑器顶部
        editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    setDirectoryVisible(false);
  }, [editor]);

  // 切换抽屉状态
  const handleToggleDirectory = useCallback(() => {
    if (!editor) return;

    if (!directoryVisible) {
      // 打开时重新获取目录
      const headings: HeadingItem[] = [];
      const doc = editor.state.doc;

      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const text = node.textContent;
          const level = node.attrs.level;
          headings.push({
            id: `heading-${pos}`,
            text: text || `标题${headings.length + 1}`,
            level,
            pos,
          });
        }
      });

      setDirectoryList(headings);
    }

    setDirectoryVisible(!directoryVisible);
  }, [editor, directoryVisible]);

  // 获取目录项样式
  const getItemStyle = (level: number) => {
    const sizes = [22, 20, 18, 16, 14, 12];
    const margins = [12, 24, 36, 48, 60, 72];
    return {
      fontSize: `${sizes[level - 1] || 14}px`,
      marginLeft: `${margins[level - 1] || 12}px`,
    };
  };

  // 插入图片
  const handleInsertImage = useCallback(() => {
    if (!editor) return;
    const imageUrl = window.prompt('输入图片 URL:', 'https://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=200&h=200');
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  }, [editor]);

  // 清空内容
  const handleClear = useCallback(() => {
    if (!editor) return;
    if (confirm('确定要清空所有内容吗？')) {
      editor.commands.clearContent();
    }
  }, [editor]);

  // 下载为 Markdown 文件
  const handleDownload = useCallback(() => {
    if (!editor) return;

    const html = editor.getHTML();
    let md = html;
    md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n');
    md = md.replace(/<p><\/p>/gi, '\n');
    md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<ul>(.*?)<\/ul>/gi, '$1');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![图片]($1)');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [editor]);

  // 保存（获取 HTML）
  const handleSave = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    console.log('HTML 内容：', html);
    alert('HTML 内容已保存到控制台，请按 F12 查看');
  }, [editor]);

  // 获取 Markdown 内容
  const handleGetMarkdown = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    // 简单转换 HTML 为 Markdown
    let md = html;
    md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n');
    md = md.replace(/<p><\/p>/gi, '\n');
    md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<ul>(.*?)<\/ul>/gi, '$1');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

    console.log('Markdown 内容：', md);
    alert('Markdown 内容已保存到控制台，请按 F12 查看');
  }, [editor]);

  // 获取 JSON
  const handleGetJson = useCallback(() => {
    if (!editor) return;
    const json = editor.getJSON();
    console.log('JSON 内容：', json);
    alert('JSON 已输出到控制台，请按 F12 查看');
  }, [editor]);

  // 获取光标属性
  const handleGetCursorAttributes = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const attrs: Record<string, unknown> = {};

    if (editor.isActive('link')) {
      attrs.link = editor.getAttributes('link');
    }
    attrs.bold = editor.isActive('bold');
    attrs.italic = editor.isActive('italic');
    attrs.strike = editor.isActive('strike');
    attrs.code = editor.isActive('code');

    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        attrs.heading = i;
        break;
      }
    }

    console.log('光标属性：', {
      position: { from, to },
      selection: editor.state.selection.content().size > 0 ? editor.state.doc.textBetween(from, to) : null,
      marks: attrs,
    });

    alert('光标属性已输出到控制台，请按 F12 查看');
  }, [editor]);

  // 聚焦编辑器
  const handleFocus = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().run();
  }, [editor]);

  // 失去焦点
  const handleBlur = useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement) {
      (activeElement as HTMLElement).blur();
    }
  }, []);

  // 查找文字
  const handleFindText = useCallback(() => {
    if (!editor) return;

    const searchText = window.prompt('输入要查找的文字:');
    if (!searchText) return;

    const doc = editor.state.doc;
    let count = 0;
    let firstPos: number | null = null;

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        const index = node.text.indexOf(searchText);
        if (index !== -1) {
          count++;
          if (firstPos === null) {
            firstPos = pos + index;
          }
        }
      }
    });

    if (firstPos !== null) {
      editor.commands.setTextSelection({
        from: firstPos,
        to: firstPos + searchText.length,
      });
      editor.commands.scrollIntoView();
      editor.commands.focus();
    }

    alert(`找到 ${count} 个匹配`);
  }, [editor]);

  // 获取纯文本
  const handleGetText = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    console.log('纯文本内容：', text);
    alert('文本内容已保存到控制台，请按 F12 查看');
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className={styles.toolbar}>
        <Space size={4}>
          <Tooltip content="导入示例 Markdown">
            <Button size="small" onClick={handleImport}>导入</Button>
          </Tooltip>

          <Tooltip content="导入带目录的长文档">
            <Button size="small" onClick={handleImportToc}>导入目录</Button>
          </Tooltip>

          <Tooltip content="获取文档目录并展示">
            <Button size="small" type="primary" onClick={handleToggleDirectory}>目录</Button>
          </Tooltip>

          <Tooltip content="在光标位置插入图片">
            <Button size="small" onClick={handleInsertImage}>图片</Button>
          </Tooltip>

          <div className={styles.divider} />

          <Tooltip content="获取焦点">
            <Button size="small" onClick={handleFocus}>焦点</Button>
          </Tooltip>

          <Tooltip content="失去焦点">
            <Button size="small" onClick={handleBlur}>失焦</Button>
          </Tooltip>

          <div className={styles.divider} />

          <Tooltip content="清空所有内容">
            <Button size="small" status="danger" onClick={handleClear}>清空</Button>
          </Tooltip>

          <Tooltip content="下载为 Markdown 文件">
            <Button size="small" onClick={handleDownload}>下载</Button>
          </Tooltip>

          <Tooltip content="保存为 HTML">
            <Button size="small" onClick={handleSave}>保存</Button>
          </Tooltip>

          <Tooltip content="获取 Markdown 格式">
            <Button size="small" type="primary" onClick={handleGetMarkdown}>MD</Button>
          </Tooltip>

          <div className={styles.divider} />

          <Tooltip content="获取 JSON 结构">
            <Button size="small" onClick={handleGetJson}>JSON</Button>
          </Tooltip>

          <Tooltip content="获取纯文本">
            <Button size="small" onClick={handleGetText}>文本</Button>
          </Tooltip>

          <Tooltip content="获取光标处格式属性">
            <Button size="small" onClick={handleGetCursorAttributes}>属性</Button>
          </Tooltip>

          <div className={styles.divider} />

          <Tooltip content="查找文字">
            <Button size="small" onClick={handleFindText}>查找</Button>
          </Tooltip>
        </Space>
      </div>

      {/* 目录 Drawer */}
      <Drawer
        title="文档目录"
        width={332}
        visible={directoryVisible}
        onOk={() => setDirectoryVisible(false)}
        onCancel={() => setDirectoryVisible(false)}
        placement="right"
      >
        <div className={styles.directoryList}>
          {directoryList.length === 0 ? (
            <div className={styles.empty}>暂无目录，请先导入带标题的文档</div>
          ) : (
            directoryList.map((item) => (
              <div
                key={item.id}
                className={styles.directoryItem}
                style={getItemStyle(item.level)}
                onClick={() => handleDirectoryClick(item)}
              >
                {item.text}
              </div>
            ))
          )}
        </div>
      </Drawer>
    </>
  );
}