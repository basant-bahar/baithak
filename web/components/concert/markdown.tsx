import * as ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Markdown(props: { children: string }) {
  return (
    <ReactMarkdown.default className="prose lg:prose-xl max-w-full" rehypePlugins={[rehypeRaw]}>
      {props.children}
    </ReactMarkdown.default>
  );
}
