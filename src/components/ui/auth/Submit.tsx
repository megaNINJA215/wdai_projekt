export interface SubmitProps {
  text: string;
  disabled: boolean;
}

export default function Submit(props: SubmitProps) {
  return (
    <button className="bg-primary-muted text-white font-bold py-2 px-4 rounded hover:bg-primary hover:cursor-pointer" type="submit" disabled={props.disabled}>
      {props.text}
    </button>
  );
};