import { computeExpiry } from "./expiryUtil.ts";

const membershipExpiry = `
query getMembership($id: Int!) {
  membership(id: $id) {
    expiry
    type
  }
}
`;
const updateMembership = `
mutation updateExpiry($id: Int!, $expiryDate: LocalDate) {
  updateMembership(id: $id, data: {expiry: $expiryDate}) {
    id
  }
}
`;

export async function processPayment(operation: Operation, exograph: Exograph) {
  const query = operation.query();
  const dataArg = query.arguments.data as {
    membership: { id: number };
    date: string;
    infoOnly: boolean;
  };
  const membershipId = dataArg?.membership?.id;
  const paymentDateStr = dataArg?.date;
  const infoOnly = dataArg?.infoOnly;

  if (!infoOnly) {
    const membership = (await exograph.executeQuery(membershipExpiry, { id: membershipId })).membership;
    const newExpiry = computeExpiry(paymentDateStr, membership?.expiry, membership?.type);

    await exograph.executeQuery(updateMembership, {
      id: membershipId,
      expiryDate: newExpiry.toISOString(),
    });
  }
}
