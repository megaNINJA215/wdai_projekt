type Props = {
  searchParams: Promise<{ c?: string }>;
};

export default async function CreatePostPage({ searchParams }: Props) {
  const { c } = await searchParams;

  return (
    <div>
      {c ? `Tworzenie posta w społeczności: ${c}` : "Tworzenie posta"}
    </div>
  );
}