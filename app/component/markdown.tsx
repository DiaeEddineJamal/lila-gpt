import React, { useEffect } from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import { Copy } from "lucide-react"; // Import the Copy icon
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Use a colorful theme
import "prismjs/components/prism-javascript"; // Add support for JavaScript
import "prismjs/components/prism-python"; // Add support for Python
import "prismjs/components/prism-bash"; // Add support for Bash
// Add more languages as needed

type Props = {
  text: string;
};

const md = markdownit({
  highlight: function (str: string, lang: string) {
    if (lang && Prism.languages[lang]) {
      try {
        const highlightedCode = Prism.highlight(str, Prism.languages[lang], lang);
        return `
          <div class="code-block-wrapper">
            <pre class="code-block"><code class="language-${lang}">${highlightedCode}</code></pre>
            <button class="copy-code-button">
              <Copy className="copy-icon" />
              <span>Copy Code</span>
            </button>
          </div>
        `;
      } catch (error) {
        console.error("Error highlighting code:", error);
      }
    }
    return `
      <div class="code-block-wrapper">
        <pre class="code-block"><code>${str}</code></pre>
        <button class="copy-code-button">
          <Copy className="copy-icon" />
          <span>Copy Code</span>
        </button>
      </div>
    `;
  },
});

const Markdown = ({ text }: Props) => {
  const htmlContent = md.render(text);
  const sanitized = DOMPurify.sanitize(htmlContent);

  // Highlight code blocks with Prism.js
  useEffect(() => {
    Prism.highlightAll();
  }, [text]);

  // Add event listeners for copy buttons
  useEffect(() => {
    const copyButtons = document.querySelectorAll(".copy-code-button");
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const code = button.parentElement?.querySelector("code")?.textContent;
        if (code) {
          navigator.clipboard.writeText(code).then(
              () => {
                alert("Code copied to clipboard!");
              },
              (err) => {
                alert("Failed to copy code: " + err);
              }
          );
        }
      });
    });

    // Cleanup event listeners
    return () => {
      copyButtons.forEach((button) => {
        button.removeEventListener("click", () => {});
      });
    };
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export default Markdown;