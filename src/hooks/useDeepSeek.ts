import { useState, useCallback, useRef } from 'react';

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UseDeepSeekOptions {
  apiKey: string;
  model?: string;
}

export interface UseDeepSeekReturn {
  isLoading: boolean;
  error: string | null;
  sendMessage: (messages: DeepSeekMessage[], onChunk: (chunk: string) => void) => Promise<string>;
  abort: () => void;
}

export const AI_PROMPTS = {
  polish: '请润色以下文本，使其更加流畅、专业：\n\n',
  expand: '请扩写以下文本，使其内容更丰富、详细：\n\n',
  shorten: '请缩写以下文本，保留核心内容，去除冗余：\n\n',
  grammar: '请检查以下文本的语法错误和不通顺的句子，给出修改建议：\n\n',
  continue: '请续写以下内容：\n\n',
};

export function useDeepSeek({ apiKey, model = 'deepseek-chat' }: UseDeepSeekOptions): UseDeepSeekReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (messages: DeepSeekMessage[], onChunk: (chunk: string) => void): Promise<string> => {
      setIsLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      let fullContent = '';

      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 4096,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('响应体为空');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';

                if (content) {
                  fullContent += content;
                  onChunk(content);
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }

        return fullContent;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('请求已取消');
        } else {
          setError(err instanceof Error ? err.message : '请求失败');
        }
        throw err;
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiKey, model]
  );

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
    abort,
  };
}

export function useAIRewrite(apiKey: string) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [result, setResult] = useState('');
  const { sendMessage, abort } = useDeepSeek({ apiKey });

  const rewrite = useCallback(
    async (
      text: string,
      type: 'polish' | 'expand' | 'shorten' | 'grammar' | 'custom',
      customPrompt?: string
    ) => {
      setIsRewriting(true);
      setResult('');

      let prompt: string;

      if (type === 'custom' && customPrompt) {
        prompt = customPrompt + text;
      } else {
        const prompts: Record<string, string> = {
          polish: AI_PROMPTS.polish,
          expand: AI_PROMPTS.expand,
          shorten: AI_PROMPTS.shorten,
          grammar: AI_PROMPTS.grammar,
        };
        prompt = prompts[type] + text;
      }

      try {
        await sendMessage([{ role: 'user', content: prompt }], (chunk) => {
          setResult((prev) => prev + chunk);
        });
      } catch (err) {
        console.error('AI改写失败:', err);
      } finally {
        setIsRewriting(false);
      }
    },
    [sendMessage]
  );

  return {
    isRewriting,
    result,
    rewrite,
    abort,
  };
}