"use server";

import { revalidatePath } from "next/cache";

export async function revalidateSSRPages(...pagePaths: string[]) {
  pagePaths.forEach((pagePath) => revalidatePath(pagePath, "page"));
}
