import { useContext } from "react";

import { ClockifyContext } from "@contexts/clockify";

export const useClockify = () => {
  return useContext(ClockifyContext);
};
