import type { ReactNode } from "react";

/**
 * Minimal Contentful Rich Text renderer — paragraphs, hyperlinks and the
 * bold/italic/underline marks. Extend the switch as sections need more nodes.
 */
export type RichTextDocument = {
  nodeType: "document";
  content: RichTextNode[];
};

type RichTextNode = {
  nodeType: string;
  value?: string;
  marks?: Array<{ type: string }>;
  data?: { uri?: string };
  content?: RichTextNode[];
};

type RenderOptions = {
  paragraphClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  /** Class for hyperlinks (default: "underline"). */
  linkClassName?: string;
  /** Open hyperlinks in a new tab (adds rel="noopener") and label them with their text. */
  linkNewTab?: boolean;
};

const nodeText = (nodes: RichTextNode[] = []): string =>
  nodes.map((n) => n.value ?? nodeText(n.content)).join("");

const renderText = (node: RichTextNode, key: number): ReactNode => {
  let out: ReactNode = node.value ?? "";
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        out = <strong>{out}</strong>;
        break;
      case "italic":
        out = <em>{out}</em>;
        break;
      case "underline":
        out = <u>{out}</u>;
        break;
    }
  }
  return <span key={key}>{out}</span>;
};

const renderInline = (nodes: RichTextNode[] = [], options: RenderOptions = {}): ReactNode[] =>
  nodes.map((node, i) => {
    switch (node.nodeType) {
      case "text":
        return renderText(node, i);
      case "hyperlink":
        return (
          <a
            key={i}
            href={node.data?.uri}
            className={options.linkClassName ?? "underline"}
            target={options.linkNewTab ? "_blank" : undefined}
            rel={options.linkNewTab ? "noopener" : undefined}
            aria-label={options.linkNewTab ? nodeText(node.content) : undefined}
          >
            {renderInline(node.content, options)}
          </a>
        );
      default:
        return null;
    }
  });

const renderBlocks = (
  nodes: RichTextNode[] = [],
  options: RenderOptions
): ReactNode[] =>
  nodes.map((node, i) => {
    switch (node.nodeType) {
      case "paragraph":
        return (
          <p key={i} className={options.paragraphClassName}>
            {renderInline(node.content, options)}
          </p>
        );
      case "unordered-list":
        return (
          <ul key={i} className={options.listClassName}>
            {renderBlocks(node.content, options)}
          </ul>
        );
      case "list-item":
        return (
          <li key={i} className={options.listItemClassName}>
            {renderBlocks(node.content, { ...options, paragraphClassName: undefined })}
          </li>
        );
      default:
        return null;
    }
  });

export const renderRichText = (
  doc: RichTextDocument | null | undefined,
  options: RenderOptions = {}
): ReactNode => {
  if (!doc?.content?.length) return null;
  return renderBlocks(doc.content, options);
};
