import React, { FC } from "react";
import Image from "next/image";

export const Logo: FC = () => {
  return <Image src="/images/logo.png" width={200} height={46} alt="Baithak" priority />;
};
