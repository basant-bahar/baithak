"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useRouter } from "next/navigation";
import { graphql } from "__generated__";
import { getDateStr, getSimpleDate } from "utils";

interface PaymentInfoProps {
  params: { id: string };
}

export default function PaymentAndInfo(props: PaymentInfoProps) {
  const router = useRouter();
  const membershipId = parseInt(props.params.id);
  const [payments, setPayments] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>({ date: new Date(), note: "", infoOnly: false });
  const [getPayments] = useLazyQuery(getPaymentsForMembership);
  const paymentDate = getDateStr(new Date());
  const isPayment = !payment.infoOnly;
  const header = isPayment ? "Post Payment" : "Post Info";
  const [createPaymentMutation] = useMutation(createPayment, {
    refetchQueries: [{ query: getPaymentsForMembership, variables: { id: membershipId } }],
  });

  useEffect(() => {
    let fetchActive = true;
    const fetchData = async () => {
      const { data, loading } = await getPayments({
        variables: { id: membershipId },
      });
      if (fetchActive && data && !loading) {
        setPayments(data?.payments);
      }
    };
    fetchData();
    return () => {
      fetchActive = false;
    };
  }, [membershipId, getPayments]);

  const existingPayments =
    payments &&
    payments.map((payment) => {
      return (
        <>
          <div key={`date-${payment.id}`}>{payment.date}</div>
          <div key={`note-${payment.id}`}>{payment.note}</div>
        </>
      );
    });

  const handlePaymentCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment({ ...payment, infoOnly: !e.target.checked });
  };

  const changePaymentDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paymentDate = getSimpleDate(new Date(Date.parse(e.target.value)));
    setPayment({ ...payment, date: paymentDate });
  };

  const changePaymentNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPayment({ ...payment, note: e.target.value });
  };

  const save = () => {
    createPaymentMutation({
      variables: {
        data: {
          membership: {
            id: membershipId,
          },
          ...payment,
        },
      },
    }).then((_) => router.back());
  };

  return (
    <div className="main-container">
      <div className="pt-5">
        <h3 className="font-bold">Past Payments</h3>
        <div className="grid grid-cols-2 border-b pb-2 mb-4">
          <div key="date" className="font-bold mb-2">
            Date
          </div>
          <div key="note" className="font-bold mb-2">
            Note
          </div>
          {existingPayments}
        </div>
        <div className="mb-4 mt-6">
          <input className="" type="checkbox" checked={isPayment} onChange={handlePaymentCheck} />
          <label className="pl-4">
            Posting payment (If checked will update the expiration date)
          </label>
        </div>
        <h3 className="font-bold">{header}</h3>
        <div className="border p-2">
          <div className="border-b pb-2 mb-2">
            Payment (for new membership or renewal from current expiration date)
          </div>
          {isPayment && (
            <div className="form-row">
              <label className="form-label">Payment date</label>
              <input
                className="simple-input"
                type="date"
                value={paymentDate}
                step={15 * 60}
                onChange={(date) => changePaymentDate(date)}
              />
            </div>
          )}
          <div className="form-row">
            <label className="form-label">Note</label>
            <textarea
              className="simple-input border p-2 col-span-2"
              rows={5}
              placeholder="Payment note"
              onChange={changePaymentNote}
              value={payment.note}
            />
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-8 mt-4 mb-4">
            <button
              className="text-white bg-green-600 hover:bg-green-700 lg:col-start-3 ml-3"
              onClick={() => save()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getPaymentsForMembership = graphql(`
  query getPaymentsForMembership($id: Int!) {
    payments(where: { membership: { id: { eq: $id } } }) {
      id
      date
      note
      infoOnly
    }
  }
`);

const createPayment = graphql(`
  mutation createPayment($data: PaymentCreationInput!) {
    createPayment(data: $data) {
      membership {
        id
      }
      date
      note
      infoOnly
    }
  }
`);
