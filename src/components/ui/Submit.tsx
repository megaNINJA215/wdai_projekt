import { cn } from "@/utils/cn";

export interface SubmitProps {
  text: string;
  disabled: boolean;
  style?: string;
}

export default function Submit(props: SubmitProps) {
  return (
    <button className={cn("bg-primary-muted text-white font-bold py-2 px-4 rounded hover:bg-primary hover:cursor-pointer", props.style)} type="submit" disabled={props.disabled}>
      {props.text}
    </button>
  );
};