export const ORGANIZATION_NAME = process.env.NEXT_PUBLIC_ORGANIZATION_NAME;

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

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export function getDateStr(rawDate?: string | Date): string {
  let localDate;
  if (rawDate && rawDate instanceof Date) {
    localDate = rawDate ? rawDate : new Date();
  } else {
    localDate = rawDate ? new Date(new Date(rawDate + "Z")) : new Date();
  }
  let localDateStr = localDate.toLocaleDateString("en-US", dateOptions);
  const arr = localDateStr.split("/");
  localDateStr = arr[2] + "-" + arr[0] + "-" + arr[1];
  return localDateStr;
}

export function getDateTimeStr(rawDate?: string): string {
  const time24Options: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  const localDate = rawDate ? new Date(new Date(rawDate + "Z")) : new Date();
  let localDateStr = getDateStr(rawDate);

  const localTimeStr = localDate.toLocaleTimeString([], time24Options);
  return localDateStr + "T" + localTimeStr;
}

export function getSimpleDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function parseDateYYYYMMDD(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  const startDate = new Date();
  startDate.setFullYear(parseInt(year));
  startDate.setMonth(parseInt(month) - 1);
  startDate.setDate(parseInt(day));
  return startDate;
}

export async function handleFileUpload(
  file: File,
  authToken: string | null
): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_UPLOAD_URL) return "";

  const resizedImageBlob = await resizeImage(file, 800, 600);
  if (!resizedImageBlob) return null;

  const resizedFile = new File([resizedImageBlob], file.name);
  const headers = {
    authorization: authToken ? `Bearer ${authToken}` : "",
  };
  const data = new FormData();
  data.append("file", resizedFile);
  const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL, {
    method: "POST",
    headers,
    body: data,
  });
  const result = await response.json();

  return result.path;
}

function resizeImage(file: File, destWidth: number, destHeight: number): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const sourceWidth = image.width;
      const sourceHeight = image.height;

      const widthRatio = destWidth / sourceWidth;
      const heightRatio = destHeight / sourceHeight;

      const ratio = Math.max(widthRatio, heightRatio);
      const sx = Math.abs(destWidth - sourceWidth * ratio) / 2 / ratio;
      const sy = Math.abs(destHeight - sourceHeight * ratio) / 2 / ratio;

      const canvas = document.createElement("canvas");
      canvas.width = destWidth;
      canvas.height = destHeight;

      const context = canvas.getContext("2d");

      context?.drawImage(
        image,
        sx,
        sy,
        sourceWidth - 2 * sx,
        sourceHeight - 2 * sy,
        0,
        0,
        destWidth,
        destHeight
      );

      canvas.toBlob(resolve, file.type);
    };
    image.onerror = reject;
  });
}

export function getVenueAddress(venue: {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}) {
  const showAddress = venue && venue.name !== "Online" && venue.name !== "TBD";
  return showAddress ? `${venue.street}, ${venue.city} ${venue.state} ${venue.zip}` : "";
}
