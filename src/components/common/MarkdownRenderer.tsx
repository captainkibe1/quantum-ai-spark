
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// Simple Markdown renderer function - in a production app, use a proper Markdown library
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Process the markdown text with basic regex replacements
  // (Note: This is a very simplified implementation - for production use a library like react-markdown)
  const processMarkdown = (text: string) => {
    if (!text) return '';
    
    let processed = text;
    
    // Process code blocks
    processed = processed.replace(/```(.+?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Process inline code
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Process headers (h1, h2, h3)
    processed = processed.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    processed = processed.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    processed = processed.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Process emphasis (bold and italic)
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Process links
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process unordered lists
    processed = processed.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
    processed = processed.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Process ordered lists
    processed = processed.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    processed = processed.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
    
    // Process paragraphs (any text block separated by blank lines)
    processed = processed.replace(/^(?!<[a-z]).+/gm, '<p>$&</p>');
    
    return processed;
  };

  return (
    <div 
      className="markdown"
      dangerouslySetInnerHTML={{ __html: processMarkdown(content) }} 
    />
  );
};

export default MarkdownRenderer;
