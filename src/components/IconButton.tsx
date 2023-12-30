import { ComponentProps, cloneElement, forwardRef } from "react";
import { StyleHelper } from "../helpers/StyleHelper";

type TProps = {
  icon: JSX.Element;
} & ComponentProps<"button">;

export const IconButton = forwardRef<HTMLButtonElement, TProps>(
  ({ icon, className, ...props }, ref) => {
    const { className: iconClassName, ...iconProps } = icon.props;
    return (
      <button
        className={StyleHelper.mergeStyles(
          "min-w-[1.75rem] max-w-[1.75rem] min-h-[1.75rem] max-h-[1.75rem] rounded-md flex items-center justify-center bg-grey-600 hover:bg-grey-600/80!text-grey-100",
          className
        )}
        ref={ref}
        {...props}
      >
        {cloneElement(icon, {
          ...iconProps,
          className: StyleHelper.mergeStyles("w-4 h-4", iconClassName),
        })}
      </button>
    );
  }
);
