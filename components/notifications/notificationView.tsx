type NotificationViewProps = {
  subject: string;
  formatedBody: string;
};

export default function NotificationView(props: NotificationViewProps) {
  return (
    <>
      <div className="flex justify-center mb-4">
        <label className="form-label font-bold">Subject:</label>
        <div className="">{props.subject}</div>
      </div>
      <iframe className="w-full min-h-screen" srcDoc={props.formatedBody}></iframe>
    </>
  );
}
