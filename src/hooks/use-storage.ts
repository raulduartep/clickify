import { useContext } from "react";

import { StorageContext } from "@contexts/storage";

export const useStorage = () => {
  return useContext(StorageContext);
};
