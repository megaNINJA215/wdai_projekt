export interface LoadingErrorProps {
  error: Error | unknown;
  isFetchNextPageError: boolean;
  fetchNextPage: any;
  refetch: any;
}

export default function LoadingError(props: LoadingErrorProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 text-primary text-md font-semibold w-full max-w-200 mx-auto px-10 mb-20">
      {props.error instanceof Error
        ? props.error.message
        : "Wystąpił nieoczekiwany błąd."}
      <button
        className="bg-danger text-white px-4 py-2 rounded-md hover:cursor-pointer text-nowrap"
        type="button"
        onClick={() => {
          if (props.isFetchNextPageError) {
            void props.fetchNextPage();
          } else {
            void props.refetch();
          }
        }}
      >
        Spróbuj ponownie
      </button>
    </div>
  );
};