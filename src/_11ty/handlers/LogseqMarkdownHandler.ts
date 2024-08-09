// Handle the particulars of rendering a Logseq Markdown block
import MarkdownIt from "markdown-it";

export default function () {
  return MarkdownIt({
    html: true,
    typographer: true,
    linkify: true,
  });
}