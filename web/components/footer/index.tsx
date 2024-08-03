import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full flex justify-end gap-4 p-4 pr-6 text-secondary bg-primary">
      <Link href={"/privacy-policy"}>Privacy Policy</Link>
    </footer>
  );
}
