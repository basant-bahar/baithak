import React from "react";
import Image from "next/image";

export default function Logo() {
  return <Image src="/images/logo.png" width={200} height={46} alt="Baithak" priority />;
}
