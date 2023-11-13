import "../assets/css/global.css";

import { StrictMode } from "react";

type Props = {
  children: React.ReactNode;
};

export const Container = ({ children }: Props) => {
  return <StrictMode>{children}</StrictMode>;
};
