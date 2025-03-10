"use client";

import React, { useState } from "react";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

const MarkdownPage: React.FC = () => {
  const [input, setInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(input)
      .then(() => alert("Markdown copied to clipboard!"))
      .catch(() => alert("Failed to copy text."));
  };

  const renderMarkdown = () => {
    return { __html: md.render(input) };
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
      <p className="mb-6">
        Write Markdown in the editor below and see the live preview on the right.
        To learn more about Markdown syntax, visit the{" "}
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Markdown Guide
        </a>.
      </p>

      <div className="flex gap-6">
        {/* Input Section */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">Input</h2>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={15}
            className="w-full border border-gray-300 p-4 rounded-md shadow-xs text-base"
          />
          <button
            onClick={handleCopy}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-xs hover:bg-blue-600"
          >
            Copy Markdown
          </button>
        </div>

        {/* Preview Section */}
        <div className="w-1/2 border border-gray-300 p-4 rounded-md shadow-xs">
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <div
            dangerouslySetInnerHTML={renderMarkdown()}
            className="prose prose-lg max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownPage;
