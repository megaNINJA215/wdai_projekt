import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export type ValidationState =
  | "empty"
  | "invalid"
  | "warning"
  | "valid";

export interface InputProps {
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => ValidationState;
  ignoreWarning?: boolean;
  required?: boolean;
  style?: string;
}

const validationColors: Record<ValidationState, string> = {
  empty: "text-text",
  invalid: "text-danger",
  warning: "text-warning",
  valid: "text-success",
};

export default function Input(props: InputProps) {
  const [validationState, setValidationState] =
    useState<ValidationState>("empty");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!props.value) {
        setValidationState("empty");
        return;
      }

      if (props.validate) {
        const state = props.validate(props.value);
        if (state === "warning" && props.ignoreWarning) {
          setValidationState("valid");
        } else {
          setValidationState(state);
        }
      } else {
        setValidationState("valid");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [props.value, props.validate]);

  return (
    <div className={cn("relative w-full mb-4 text-2xl", props.style)}>
      <input
        className={cn("peer w-full h-10 bg-bg-secondary text-fg-primary rounded-lg px-4") + " focus:outline-none border-2 border-primary placeholder-transparent"}
        placeholder={props.placeholder}
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={!!props.required}
      />

      <label
        className={`
          pointer-events-none absolute left-0 top-0 h-10 translate-x-4 leading-10 whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-500
          peer-focus:left-4 peer-focus:-top-8.75 peer-focus:-translate-x-2 peer-focus:text-base
          peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:-top-8.75 peer-not-placeholder-shown:-translate-x-2 peer-not-placeholder-shown:text-base
          ${validationColors[validationState]}
          `}
      >
        {props.placeholder}
      </label>
    </div>
  );
}
