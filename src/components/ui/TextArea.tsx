
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

export type ValidationState =
  | "empty"
  | "invalid"
  | "warning"
  | "valid";

export interface TextAreaProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => ValidationState;
  ignoreWarning?: boolean;
  required?: boolean;
  style?: string;
  textSize?: "small" | "normal";
  minRows?: number;
  maxRows?: number;
}

const validationColors: Record<ValidationState, string> = {
  empty: "text-text",
  invalid: "text-danger",
  warning: "text-warning",
  valid: "text-success",
};

export default function TextArea(props: TextAreaProps) {
  const [validationState, setValidationState] =
    useState<ValidationState>("empty");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight);
    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

    const minHeight = lineHeight * (props.minRows ?? 2) + padding;

    const maxHeight = props.maxRows ? lineHeight * props.maxRows + padding : Infinity;

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value, props.minRows, props.maxRows]);

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
  }, [
    props.value,
    props.validate,
    props.ignoreWarning,
  ]);

  return (
    <div className={cn("relative w-full mb-4", props.style)}>
      <textarea
        ref={textareaRef}
        className={cn(
          "peer w-full bg-bg-secondary text-fg-primary rounded px-4 py-2 resize-none ring-2 ring-primary focus:outline-none placeholder-transparent",
          props.textSize === "small" ? "text-md leading-6" : "text-2xl leading-8"
        )}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={(e) => { props.onChange(e.target.value); adjustHeight(); }}
        required={props.required}
        rows={props.minRows ?? 2}
      />

      <label
        className={`
          pointer-events-none absolute left-0 top-0
          translate-x-4 py-2
          whitespace-nowrap overflow-hidden text-ellipsis
          transition-all duration-300
          peer-focus:left-4 peer-focus:-top-8
          peer-focus:-translate-x-2 peer-focus:py-0
          peer-focus:text-base
          peer-not-placeholder-shown:left-4
          peer-not-placeholder-shown:-top-8
          peer-not-placeholder-shown:-translate-x-2
          peer-not-placeholder-shown:py-0
          peer-not-placeholder-shown:text-base
          ${validationColors[validationState]}
          ${props.textSize === "small" ? "text-md" : "text-2xl"}
        `}
      >
        {props.placeholder}
      </label>
    </div>
  );
}
