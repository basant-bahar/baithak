import * as ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Markdown(props: { children: string }) {
  return (
    <ReactMarkdown.default className="prose max-w-full leading-4" rehypePlugins={[rehypeRaw]}>
      {props.children}
    </ReactMarkdown.default>
  );
}
