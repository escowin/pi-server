import { useState, lazy, Suspense, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

// Lazy load the syntax highlighter with our custom Prism config
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism
  }))
);

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  description?: string;
}

export default function CodeBlock({ code, language, title, description }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<any>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Lazy load the theme and our custom Prism configuration
  useEffect(() => {
    const loadLanguageAndTheme = async () => {
      // Load theme
      const themeModule = await import('react-syntax-highlighter/dist/esm/styles/prism');
      setTheme(themeModule.vscDarkPlus);
      
      // Load our custom Prism configuration with only the languages we need
      try {
        await import('../lib/prism-config');
      } catch (error) {
        console.warn('Custom Prism configuration could not be loaded:', error);
      }
    };
    
    loadLanguageAndTheme();
  }, []);

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
        
        <Suspense fallback={
          <div className="p-4 text-gray-400 text-sm">
            Loading syntax highlighter...
          </div>
        }>
          {theme && (
            <SyntaxHighlighter
              language={language}
              style={theme}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              showLineNumbers
              wrapLines
            >
              {code}
            </SyntaxHighlighter>
          )}
        </Suspense>
      </div>
    </div>
  );
}
