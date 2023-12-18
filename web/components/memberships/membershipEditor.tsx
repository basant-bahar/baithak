import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDateStr } from "utils";
import { MembershipOnlyDetailsFragment } from "../../__generated__/graphql";
import ManagePayment from "./managePayment";
import TermsAndConditions from "./terms";
import { useIsAdmin } from "components/auth/providers";

export interface MemberAuthInfo {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

interface MembershipEditorProps {
  membershipId?: string;
  membership?: MembershipOnlyDetailsFragment;
  authUserId: string;
  authUser: MemberAuthInfo;
  done: Function;
  manage?: boolean;
  allowAuthInfoUpdate?: boolean;
  validate?: Function;
}

const newMembership: MembershipOnlyDetailsFragment = {
  spouseFirstName: "",
  spouseLastName: "",
  spouseEmail: "",
  type: "",
  expiry: null,
};

const newAuthUserInfo: MemberAuthInfo = {
  firstName: "",
  lastName: "",
  email: "",
};

export default function MembershipEditor(props: MembershipEditorProps) {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  const [membership, setMembership] = useState<MembershipOnlyDetailsFragment>(
    props.membership
      ? {
          type: props.membership.type,
          spouseFirstName: props.membership.spouseFirstName,
          spouseLastName: props.membership.spouseLastName,
          spouseEmail: props.membership.spouseEmail,
          expiry: props.membership.expiry,
        }
      : newMembership
  );
  const [memberAuthInfo, setMemberAuthInfo] = useState<MemberAuthInfo>(
    props.authUser
      ? {
          firstName: props.authUser.firstName,
          lastName: props.authUser.lastName,
          email: props.authUser.email,
        }
      : newAuthUserInfo
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const membershipTypes = ["Couple", "Family", "Individual", "Life"];
  const [showTerms, setShowTerms] = useState(false);
  const isIndividual = membership.type === "Individual";
  const allowAdminEdit = isAdmin;
  const allowUserUpdate = props.manage && props.membershipId;
  const allowUserCreate = props.manage && !props.membershipId;
  const allowFirstNameChange = (allowUserCreate && !props.authUser?.firstName) || isAdmin;
  const allowLastNameChange = (allowUserCreate && !props.authUser?.lastName) || isAdmin;

  function changeFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, firstName: e.target.value });
  }

  function changeLastName(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, lastName: e.target.value });
  }

  function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, email: e.target.value });
  }

  function changeSpouseFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    setMembership({ ...membership, spouseFirstName: e.currentTarget.value });
  }

  function changeSpouseLastName(e: React.ChangeEvent<HTMLInputElement>) {
    setMembership({ ...membership, spouseLastName: e.currentTarget.value });
  }

  function changeSpouseEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setMembership({ ...membership, spouseEmail: e.currentTarget.value });
  }

  function changeType(e: React.ChangeEvent<HTMLSelectElement>) {
    setMembership({ ...membership, type: e.currentTarget.value });
  }

  const save = async () => {
    if (!props.validate) {
      props.done({ ...membership, authUser: { id: props.authUserId, ...memberAuthInfo } });
    } else {
      const allowAdding = await props.validate({
        ...membership,
        authUser: { id: props.authUserId },
      });
      if (allowAdding) {
        props.done({ ...membership, authUser: { id: props.authUserId, ...memberAuthInfo } });
      } else {
        setErrorMessage("Membership for this email address already exists.");
      }
    }
  };

  function handleShowTerms(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setShowTerms(!showTerms);
  }

  function handlePaymentAndInfo() {
    router.push(`/admin/memberships/payment/${props.membershipId}`);
  }

  return (
    <div>
      <div className="flex-auto p-6 max-xs:p-0">
        <div className="form-row">
          <label className="form-label">Membership Type</label>
          <select
            className="bg-transparent border-b focus:outline-none disabled:opacity-50"
            onChange={changeType}
            value={membership.type}
            disabled={!allowAdminEdit && !allowUserCreate}
          >
            <option value="">Select membership type</option>
            {membershipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label className="form-label">Name</label>
          <input
            className="simple-input mr-1"
            placeholder="First name"
            value={memberAuthInfo.firstName || ""}
            onChange={changeFirstName}
            disabled={!allowFirstNameChange}
          />
          <input
            className="simple-input"
            placeholder="Last name"
            value={memberAuthInfo.lastName || ""}
            onChange={changeLastName}
            disabled={!allowLastNameChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="simple-input"
            placeholder="Email address"
            value={memberAuthInfo.email ? memberAuthInfo.email : ""}
            onChange={changeEmail}
            disabled={!allowAdminEdit || !props.allowAuthInfoUpdate}
          />
        </div>
        {!isIndividual && (
          <>
            <div className="form-row">
              <label className="form-label">Spouse Name</label>
              <input
                className="simple-input mr-1"
                placeholder="First name"
                onChange={changeSpouseFirstName}
                value={membership.spouseFirstName || ""}
                disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
              />
              <input
                className="simple-input"
                placeholder="Last name"
                onChange={changeSpouseLastName}
                value={membership.spouseLastName || ""}
                disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Spouse Email</label>
              <input
                className="simple-input"
                placeholder="Spouse Email"
                onChange={changeSpouseEmail}
                value={membership.spouseEmail || ""}
                disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
              />
            </div>
          </>
        )}
        {membership.expiry && (
          <div className="form-row">
            <label className="form-label">Expires On</label>
            <input
              className="simple-input"
              type="date"
              value={getDateStr(membership.expiry)}
              readOnly
              disabled={true}
            />
          </div>
        )}
        {errorMessage && (
          <div className="form-row text-red-600">
            <div className="col-start-2">{errorMessage}</div>
          </div>
        )}
      </div>
      {props.manage && (
        <div className="form-row">
          <div className="flex flex-col pl-4 max-xs:pl-0 gap-2 col-start-2 col-span-2 max-xs:col-start-1">
            <div className="justify-self-center">
              By signing up for the membership you are agreeing to our{" "}
              <a className="cursor-pointer underline" onClick={handleShowTerms}>
                Terms and Conditions
              </a>
            </div>
            {showTerms && (
              <div className="col-span-3 justify-self-center pt-2 pb-4">
                <TermsAndConditions />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="form-row mb-4">
        <div className="flex pl-4 max-xs:pl-0 gap-2 col-start-2 max-xs:col-start-1">
          <button
            className="text-white bg-green-600 hover:bg-green-700 max-w-[10rem]"
            onClick={() => save()}
            disabled={(!allowAdminEdit && !allowUserUpdate && !allowUserCreate) || !membership.type}
          >
            Save
          </button>
          {!props.manage && (
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 max-w-[10rem]"
              onClick={() => handlePaymentAndInfo()}
              disabled={!props.membershipId}
            >
              Post Payment/Info
            </button>
          )}
        </div>
      </div>
      {props.manage && props.membershipId && membership && (
        <div className="flex-auto p-6">
          <hr className="mt-4" />
          <ManagePayment membership={membership} />
        </div>
      )}
    </div>
  );
}
