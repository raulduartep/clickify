import { IconLoader2 } from "@tabler/icons-react";
import { ComponentProps } from "react";
import { StyleHelper } from "../helpers/StyleHelper";

type TProps = {
  variant?: "contained" | "outlined";
  label: string;
  loading?: boolean;
} & ComponentProps<"button">;

const ContainedButton = ({ label, loading, className, ...props }: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        "h-10 px-4 flex justify-center items-center rounded-lg bg-brand text-gray-100 font-bold transition-colors",
        "aria-[disabled=false]:hover:bg-brand/90 cursor-pointer",
        "aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50",
        className
      )}
      type="submit"
      aria-disabled={loading}
      {...props}
    >
      {loading ? (
        <IconLoader2 className="w-4 h-4 stroke-gray-100 animate-spin" />
      ) : (
        label
      )}
    </button>
  );
};

const OutlinedButton = ({
  label,
  className,
  loading,
  disabled,
  ...props
}: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        "h-10 px-4 flex justify-center items-center rounded-lg border border-brand text-brand font-bold transition-colors",
        "aria-[disabled=false]:hover:bg-brand/20",
        "aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50",
        className
      )}
      aria-disabled={loading ?? disabled}
      disabled={loading ?? disabled}
      {...props}
    >
      {loading ? (
        <IconLoader2 className="w-4 h-4 stroke-brand animate-spin" />
      ) : (
        label
      )}
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
