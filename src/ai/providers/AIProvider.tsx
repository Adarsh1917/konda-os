import type {
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

export default function AIProvider({
  children,
}: Props) {
  return children;
}