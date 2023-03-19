import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getDateStr } from "../../utils";
import { MembershipOnlyDetailsFragment } from "../../__generated__/graphql";
import { isAdmin, useAuth } from "../auth/authProvider";
import ManagePayment from "./managePayment";
import TermsAndConditions from "./terms";

export interface MemberAuthInfo {
  firstName: string;
  lastName: string;
  email?: string | null;
}
interface MembershipEditorProps {
  membershipId?: number;
  membership?: MembershipOnlyDetailsFragment;
  authId?: number;
  authUser?: MemberAuthInfo;
  done: Function;
  manage?: boolean;
  allowAuthInfoUpdate?: boolean;
  validate?: Function;
}

const newMembership: MembershipOnlyDetailsFragment = {
  phone: "",
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
  const [loggedInUser] = useAuth();
  const [membership, setMembership] = useState<MembershipOnlyDetailsFragment>(
    props.membership
      ? {
          type: props.membership.type,
          phone: props.membership.phone,
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
  const membershipTypes = ["Select membership", "Couple", "Family", "Individual", "Life"];
  const [showTerms, setShowTerms] = useState(false);
  const isIndividual = membership.type === "Individual";
  const allowAdminEdit = isAdmin(loggedInUser);
  const allowUserUpdate = props.manage && props.membershipId;
  const allowUserCreate = props.manage && !props.membershipId;

  function changeFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, firstName: e.target.value });
  }

  function changeLastName(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, lastName: e.target.value });
  }

  function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setMemberAuthInfo({ ...memberAuthInfo, email: e.target.value });
  }

  function changePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setMembership({ ...membership, phone: e.currentTarget.value });
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
      props.done({ ...membership, authUser: { id: props.authId, ...memberAuthInfo } });
    } else {
      const allowAdding = await props.validate({
        ...membership,
        authUser: { id: props.authId, ...memberAuthInfo },
      });
      if (allowAdding) {
        props.done({ ...membership, authUser: { id: props.authId, ...memberAuthInfo } });
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
            {membershipTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label className="form-label">Name</label>
          <input
            className="simple-input mr-1"
            placeholder="First name"
            value={memberAuthInfo.firstName}
            onChange={changeFirstName}
            disabled={!allowAdminEdit || !props.allowAuthInfoUpdate}
          />
          <input
            className="simple-input"
            placeholder="Last name"
            value={memberAuthInfo.lastName}
            onChange={changeLastName}
            disabled={!allowAdminEdit || !props.allowAuthInfoUpdate}
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
        <div className="form-row">
          <label className="form-label">Phone</label>
          <div className="flex w-3/4">
            <input
              type="tel"
              className="simple-input mr-1"
              placeholder="888 888 8888"
              onChange={changePhone}
              value={membership.phone}
              disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
            />
          </div>
        </div>
        {!isIndividual && (
          <>
            <div className="form-row">
              <label className="form-label">Spouse Name</label>
              <input
                className="simple-input mr-1"
                placeholder="First name"
                onChange={changeSpouseFirstName}
                value={membership.spouseFirstName}
                disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
              />
              <input
                className="simple-input"
                placeholder="Last name"
                onChange={changeSpouseLastName}
                value={membership.spouseLastName}
                disabled={!allowAdminEdit && !allowUserCreate && !allowUserUpdate}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Spouse Email</label>
              <input
                className="simple-input"
                placeholder="Spouse Email"
                onChange={changeSpouseEmail}
                value={membership.spouseEmail}
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
        {errorMessage && <div className="ml-48 text-red-600">{errorMessage}</div>}
      </div>
      {props.manage && (
        <>
          <div className="p-6 form-row">
            <div className="pl-3 col-span-3 justify-self-center">
              By signing up for the membership you are agreeing to our{" "}
              <a className="cursor-pointer underline" onClick={handleShowTerms}>
                Terms and Conditions
              </a>{" "}
            </div>
          </div>
          {showTerms && (
            <div className="form-row p-6 pt-2 pb-4">
              <div className="pl-3 col-span-3 justify-self-center">
                <TermsAndConditions />
              </div>
            </div>
          )}
        </>
      )}
      <div className="grid grid-cols-4 lg:grid-cols-8 mt-4 mb-4">
        <button
          className="text-white bg-green-600 hover:bg-green-700 col-start-2 max-xs:col-start-1"
          onClick={() => save()}
          disabled={!allowAdminEdit && !allowUserUpdate && !allowUserCreate}
        >
          Save
        </button>
        {!props.manage && (
          <button
            className="col-span-2 text-white bg-blue-500 hover:bg-blue-600 max-xs:col-span-2 ml-2"
            onClick={() => handlePaymentAndInfo()}
          >
            Post Payment/Info
          </button>
        )}
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
