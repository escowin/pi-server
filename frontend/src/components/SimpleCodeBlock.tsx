import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface SimpleCodeBlockProps {
  code: string;
  language: string;
  title?: string;
  description?: string;
}

// Simple syntax highlighting for the languages we use
const highlightCode = (code: string, language: string): string => {
  if (language === 'bash') {
    return code
      .replace(/(#.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(sudo|apt|npm|docker|systemctl|ufw|nginx)/g, '<span class="keyword">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="string">$1</span>');
  }
  
  if (language === 'nginx') {
    return code
      .replace(/(server|location|listen|root|index|proxy_pass)/g, '<span class="keyword">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="string">$1</span>')
      .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
  }
  
  if (language === 'yaml') {
    return code
      .replace(/(version|services|build|ports|volumes|environment)/g, '<span class="keyword">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="string">$1</span>')
      .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
  }
  
  if (language === 'ini') {
    return code
      .replace(/(\[.*?\])/g, '<span class="keyword">$1</span>')
      .replace(/(=.*$)/gm, '<span class="string">$1</span>')
      .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
  }
  
  return code;
};

export default function SimpleCodeBlock({ code, language, title, description }: SimpleCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const highlightedCode = highlightCode(code, language);

  return (
    <div className="bg-secondary-900 rounded-lg overflow-hidden shadow-lg">
      {(title || description) && (
        <div className="px-4 py-3 bg-secondary-800 border-b border-secondary-700">
          {title && (
            <h4 className="text-sm font-medium text-secondary-100 mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-xs text-secondary-400">{description}</p>
          )}
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-secondary-800 hover:bg-secondary-700 text-secondary-300 hover:text-white rounded-md transition-colors z-10"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        
        <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
          <code 
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="block whitespace-pre [&_.comment]:text-green-500 [&_.keyword]:text-blue-400 [&_.string]:text-orange-400"
          />
        </pre>
      </div>
    </div>
  );
}
