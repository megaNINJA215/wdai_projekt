export default async function CommunitySeparator() {

  return (
    <div className="pt-8 flex flex-col w-9/10 mx-auto text-sm text-primary-muted font-bold relative">
      Posty:
      <div className="h-1 bg-fg-hover rounded-full" />
      <div className="w-[102%] left-[-1%] h-8 bg-linear-to-b from-bg to-transparent z-9 absolute -bottom-8" />
    </div>
  );
};