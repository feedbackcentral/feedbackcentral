import { capitalize } from "lodash";
import { HTMLInputTypeAttribute } from "react";

interface FieldProps {
  name: string;
  value?: string;
  placeholder?: string;
  isRequired?: boolean;
  inputType?: "text" | "textarea";
  type?: HTMLInputTypeAttribute;
  onChange?: (value: string) => any;
}

export const Field = ({
  name,
  placeholder,
  value,
  isRequired,
  type,
  inputType,
  onChange,
}: FieldProps) => {
  const nameCapitalized = capitalize(name);
  return (
    <div className="flex flex-col justify-center gap-3">
      <label htmlFor={name} className="text-xl">
        {nameCapitalized}
      </label>
      {!inputType || inputType === "text" ? (
        <input
          id={name}
          type={type || "text"}
          value={value}
          placeholder={placeholder}
          className="rounded-md"
          required={isRequired || false}
          onChange={e => onChange && onChange(e.target.value)}
        />
      ) : (
        <textarea
          id={name}
          value={value}
          placeholder={placeholder}
          className="rounded-md p-3"
          required={isRequired || false}
          onChange={e => onChange && onChange(e.target.value)}
        />
      )}
    </div>
  );
};
