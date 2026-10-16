import type { HeaderData } from "@/lib/sections/types";
import { HeaderDefault } from "./HeaderDefault";

type HeaderProps = { header: HeaderData };

export function Header({ header }: HeaderProps) {
  switch (header.frontEndComponent) {
    case "Header Default":
      return <HeaderDefault header={header} />;
    default:
      return <HeaderDefault header={header} />;
  }
}
