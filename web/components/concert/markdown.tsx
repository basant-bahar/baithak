import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Markdown: React.FC<{ children: string }> = (props) => {
  return (
    <ReactMarkdown className="react-markdown" rehypePlugins={[rehypeRaw]}>
      {props.children}
    </ReactMarkdown>
  );
};

export default Markdown;
