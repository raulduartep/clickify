import { ComponentProps } from "react";
import { StyleHelper } from "../helpers/StyleHelper";
import { Loader } from "./Loader";

type TProps = {
  variant?: "contained" | "outlined";
  label: string;
  loading?: boolean;
  flat?: boolean;
} & ComponentProps<"button">;

const ContainedButton = ({
  label,
  loading = false,
  className,
  disabled = false,
  flat = false,
  ...props
}: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        "flex text-xs justify-center items-center rounded-sm bg-brand !text-grey-100 font-bold transition-colors",
        "aria-[disabled=false]:hover:bg-brand/90 cursor-pointer",
        "aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50",
        {
          "h-10 px-4": !flat,
          "h-7 px-3": flat,
        },
        className
      )}
      type="submit"
      aria-disabled={loading || disabled}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader /> : label}
    </button>
  );
};

const OutlinedButton = ({
  label,
  className,
  loading = false,
  disabled = false,
  flat = false,
  ...props
}: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        "flex justify-center items-center rounded-sm border border-brand !text-brand font-bold transition-colors",
        "aria-[disabled=false]:hover:bg-brand/20",
        "aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50",
        {
          "h-10 px-4": !flat,
          "h-7 px-3": flat,
        },
        className
      )}
      aria-disabled={loading || disabled}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader className="stroke-brand" /> : label}
    </button>
  );
};

export const Button = ({ variant = "contained", ...props }: TProps) => {
  return variant === "contained" ? (
    <ContainedButton {...props} />
  ) : (
    <OutlinedButton {...props} />
  );
};
