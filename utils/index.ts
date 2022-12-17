export function imageUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${process.env.NEXT_PUBLIC_UPLOAD_URL}${path}`;
}

type DateDetails = {
  month: string;
  date: string;
  weekday: string;
  year: string;
  time: string;
};

export function getSeparatedDateDetails(localDate: Date): DateDetails {
  const month = localDate.toLocaleDateString("en-US", { month: "long" });
  const date = localDate.toLocaleDateString("en-US", { day: "numeric" });
  const weekday = localDate.toLocaleDateString("en-US", { weekday: "long" });
  const year = localDate.toLocaleDateString("en-US", { year: "numeric" });
  const time = localDate.toLocaleTimeString([], {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
  return {
    month,
    date,
    weekday,
    year,
    time,
  };
}
