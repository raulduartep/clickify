import { ComponentProps, cloneElement } from "react";
import { StyleHelper } from "../helpers/StyleHelper";

type Props = {
  leftIcon?: JSX.Element;
  hasError?: boolean;
} & ComponentProps<"input">;

export const Input = ({
  leftIcon,
  className,
  hasError = false,
  ...props
}: Props) => {
  const { className: leftIconClassName = "", ...leftIconProps } = leftIcon
    ? leftIcon.props
    : {};

  return (
    <div className="w-full relative group outline-none">
      {leftIcon &&
        cloneElement(leftIcon, {
          className: StyleHelper.mergeStyles(
            "stroke-brand stroke-1 w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2.5 group-focus-within:stroke-2",
            leftIconClassName
          ),
          ...leftIconProps,
        })}

      <input
        className={StyleHelper.mergeStyles(
          "w-full bg-gray-700 py-2.5 pr-2.5 rounded-lg placeholder-gray-400 border ring-1 ring-transparent outline-none transition-colors text-gray-100 disabled:opacity-50",
          {
            "border-red-600/70 focus:ring-red-600/70 ": hasError,
            "border-gray-600 focus:border-brand focus:ring-brand ": !hasError,
            "pl-10": !!leftIcon,
            "pl-2.5": !leftIcon,
          },
          className
        )}
        {...props}
      />
    </div>
  );
};
