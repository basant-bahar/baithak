export function imageUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${process.env.NEXT_PUBLIC_UPLOAD_URL}${path}`;
}
