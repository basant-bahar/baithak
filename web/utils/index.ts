import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";

export const ORGANIZATION_NAME = process.env.NEXT_PUBLIC_ORGANIZATION_NAME;
const UPLOAD_URL = `${process.env.NEXT_PUBLIC_UPLOAD_PROTOCOL}://${process.env.NEXT_PUBLIC_UPLOAD_HOST}:${process.env.NEXT_PUBLIC_UPLOAD_PORT}${process.env.NEXT_PUBLIC_UPLOAD_PATH}`;

export function imageUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return `${UPLOAD_URL}${path}`;
}

export const ORG_TIMEZONE: string = process.env.NEXT_PUBLIC_ORGANIZATION_TIMEZONE as string;

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: ORG_TIMEZONE,
};

export class LocalizedDate {
  private utcDate: Date;
  private localDate: Date;

  constructor(date: Date) {
    this.utcDate = date;
    const timezoneOffsetMillis = getTimezoneOffset(ORG_TIMEZONE, date);
    this.localDate = new Date(this.utcDate.getTime() + timezoneOffsetMillis);
  }

  getHours() {
    return this.localDate.getHours();
  }

  getDay() {
    return this.localDate.getDay();
  }

  getDateDisplayString() {
    return this.utcDate.toLocaleDateString("en-us", dateOptions);
  }

  getMonthString() {
    return this.utcDate.toLocaleDateString("en-US", { month: "long", timeZone: ORG_TIMEZONE });
  }
  getDateString() {
    return this.utcDate.toLocaleDateString("en-US", { day: "numeric", timeZone: ORG_TIMEZONE });
  }
  getWeekdayString() {
    return this.utcDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: ORG_TIMEZONE,
    });
  }
  getYearString() {
    return this.utcDate.toLocaleDateString("en-US", { year: "numeric", timeZone: ORG_TIMEZONE });
  }
  getTimeString() {
    return this.utcDate.toLocaleTimeString([], {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      timeZone: ORG_TIMEZONE,
    });
  }
}

export function getDateStr(rawDate?: string | Date): string {
  let normalizedDate: Date | string;
  if (rawDate && rawDate instanceof Date) {
    normalizedDate = rawDate;
  } else {
    // string date
    normalizedDate = rawDate + " T23:59:59";
  }
  return formatInTimeZone(normalizedDate, ORG_TIMEZONE as string, "yyyy-MM-dd");
}

export function getServerDateOnly(date: Date): string {
  // ISOString returns '2023-12-29T17:28:31.788Z' so split drops everything after 'T'
  return date.toISOString().split("T")[0];
}

// Datetime format as prefered by API server
export function getServerDateTime(date: Date): string {
  return date.toISOString().slice(0, -1);
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
  if (!UPLOAD_URL) return "";

  const resizedImageBlob = await resizeImage(file, 800, 600);
  if (!resizedImageBlob) return null;

  const resizedFile = new File([resizedImageBlob], file.name);
  const headers = {
    authorization: authToken ? `Bearer ${authToken}` : "",
  };
  const data = new FormData();
  data.append("file", resizedFile);
  const response = await fetch(UPLOAD_URL, {
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
