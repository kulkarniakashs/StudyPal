import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // Optional, for tables, strikethrough, etc.
import 'github-markdown-css/github-markdown.css';

function MarkdownViewer({ markdownText } : {markdownText : string}) {
    return (
        <div className="markdown-body p-4 overflow-y-auto">
            <ReactMarkdown >
                {markdownText}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownViewer;
