import { KeyboardEvent } from "react";
import { DateHelper } from "../helpers/DateHelper";
import { Input } from "./Input";

type TTimeInputProps = {
  onChangeValue: (value: string) => void;
  value: string;
};

export const ClickupTimeInput = ({ onChangeValue, value }: TTimeInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleBlur();
    }
  };

  const handleBlur = () => {
    const formattedValue = DateHelper.autoCompleteTime(value);
    onChangeValue(formattedValue);
  };

  return (
    <Input
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      value={value}
      flat
      className="text-center"
      mask="99:99"
    />
  );
};
