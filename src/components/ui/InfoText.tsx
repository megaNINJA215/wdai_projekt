export interface LoadingInfoProps {
  text: string;
}

export default function LoadingInfo(props: LoadingInfoProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 text-primary text-md font-semibold w-full max-w-200 mx-auto px-10 mb-20">
      {props.text}
    </div>
  );
};