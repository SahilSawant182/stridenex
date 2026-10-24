import type { ReactNode } from "react";

export default function PartnerWithUsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,1"
        precedence="default"
      />
      {children}
    </>
  );
}