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
};

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

const renderInline = (nodes: RichTextNode[] = []): ReactNode[] =>
  nodes.map((node, i) => {
    switch (node.nodeType) {
      case "text":
        return renderText(node, i);
      case "hyperlink":
        return (
          <a key={i} href={node.data?.uri} className="underline">
            {renderInline(node.content)}
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
            {renderInline(node.content)}
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
