import { IconLoader2, TablerIconsProps } from "@tabler/icons-react";
import { StyleHelper } from "../helpers/StyleHelper";

export const Loader = ({ className, ...props }: TablerIconsProps) => {
  return (
    <IconLoader2
      className={StyleHelper.mergeStyles(
        "w-4 h-4 stroke-grey-100 animate-spin",
        className
      )}
      {...props}
    />
  );
};
