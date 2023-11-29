import type ExographError from "./exograph.d.ts";

interface AuthContext {
  id: number;
  role: string;
}

export function prohibitBulkMembershipUpdate() {
  throw new ExographError("Bulk membership update not allowed");
}

export function updateMembershipInterceptor(operation: Operation, authContext: AuthContext) {
  if (authContext.role === "ADMIN") {
    return;
  }
  const allowedKeys = ["spouseEmail", "spouseFirstName", "spouseLastName"];
  const data = operation.query().arguments.data;
  if (data) {
    const disallowedKeys = Object.keys(data).filter((k) => allowedKeys.indexOf(k) < 0);
    if (disallowedKeys.length !== 0) {
      throw new ExographError("Unauthorized attempt to update membership");
    }
  }
}

export function createMembershipInterceptor(operation: Operation, authContext: AuthContext) {
  if (authContext.role === "ADMIN") {
    return;
  }
  const data = operation.query().arguments.data as { userId: number };
  if (data && data.userId !== authContext.id) {
    throw new ExographError("Unauthorized attempt to create membership");
  }
}
