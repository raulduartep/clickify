import { QueryClient, QueryClientProvider } from "react-query";
import "../assets/css/global.scss";

import { StrictMode } from "react";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const Container = ({ children }: Props) => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StrictMode>
  );
};
