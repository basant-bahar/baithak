import type { ExographError } from "../../generated/exograph.d.ts";
import type { Operation } from "../../generated/exograph.d.ts";

interface AuthContext {
  clerkId: string;
  role: string;
}

export function prohibitBulkMembershipUpdate() {
  throw new ExographError("Bulk membership update not allowed");
}

export function prohibitBulkMembershipCreation() {
  throw new ExographError("Bulk membership creation not allowed");
}

export function updateMembershipInterceptor(operation: Operation, authContext: AuthContext) {
  if (authContext.role === "admin") {
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
