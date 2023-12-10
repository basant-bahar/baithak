import * as ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Markdown(props: { children: string }) {
  return (
    <ReactMarkdown.default className="react-markdown" rehypePlugins={[rehypeRaw]}>
      {props.children}
    </ReactMarkdown.default>
  );
}
