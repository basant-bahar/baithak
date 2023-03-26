import PageHeader from "./pageHeader";

interface PreviewContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function PreviewContainer({ className, children }: PreviewContainerProps) {
  return (
    <div className={className}>
      <PageHeader title={"Preview"} />
      {children}
    </div>
  );
}
