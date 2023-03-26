import { useEffect, useState } from "react";
import { DocumentNode, useMutation } from "@apollo/react-hooks";

interface VerifyProps {
  email: string;
  code: string;
  action: string;
  setErrorMessage: (message: string) => void;
  verifyFunc: DocumentNode;
}
export default function Verify(props: VerifyProps) {
  const { email, code, action, setErrorMessage, verifyFunc } = props;
  const [verifyMutation] = useMutation(verifyFunc);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyMutation({
          variables: {
            email,
            code,
          },
        });
        setVerified(true);
      } catch (e: any) {
        setErrorMessage(e?.graphQLErrors[0].message);
      }
    };
    email && code && verify();
  }, [email, code, verifyMutation, setErrorMessage]);

  return <>{verified && <div className="text-center">{`Your have been ${action}d!`}</div>}</>;
}
