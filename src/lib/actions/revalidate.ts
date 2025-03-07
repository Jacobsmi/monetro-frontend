"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidate(resource: string, type: "path" | "tag") {
  if (type === "path") {
    await revalidatePath(resource);
  } else if (type === "tag") {
    await revalidateTag(resource);
  }
}
