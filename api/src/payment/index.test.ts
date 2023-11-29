import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { parseToLocalDate, computeExpiry } from './expiryUtil.ts';

function assertDateEquals(actual: Date, expected: string) {
  assertEquals(actual, parseToLocalDate(expected));
}

// =========== new membership =================

Deno.test("new membership in the middle of the month", () => {
  const expiry = computeExpiry(undefined, "2022-08-15");
  assertDateEquals(expiry, "2023-08-31");
})

Deno.test("new membership at the end of the month", () => {
  const expiry = computeExpiry(undefined, "2022-08-31");
  assertDateEquals(expiry, "2023-08-31");
})

Deno.test("new membership at the end of the year", () => {
  const expiry = computeExpiry(undefined, "2022-12-31");
  assertDateEquals(expiry, "2023-12-31");
})

// ===========  existing membership =================

Deno.test("existing membership with an expired membership", () => {
  {
    const expiry = computeExpiry("2022-08-01", "2022-08-15");
    assertDateEquals(expiry, "2023-08-31");
  }
  {
    const expiry = computeExpiry("2021-08-01", "2022-08-15");
    assertDateEquals(expiry, "2023-08-31");
  }
})

Deno.test("existing membership with an unexpired membership", () => {
  {
    const expiry = computeExpiry("2022-08-22", "2022-08-15");
    assertDateEquals(expiry, "2023-08-31");
  }
  {
    const expiry = computeExpiry("2022-10-22", "2022-08-15");
    assertDateEquals(expiry, "2023-10-31");
  }
})