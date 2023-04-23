import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Markdown(props: { children: string }) {
  return (
    <ReactMarkdown className="react-markdown" rehypePlugins={[rehypeRaw]}>
      {props.children}
    </ReactMarkdown>
  );
}
