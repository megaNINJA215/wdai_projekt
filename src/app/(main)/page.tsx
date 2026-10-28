export default function Home() {
  return (
    <div className="flex w-full items-center flex-col">
      {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="w-full h-100 bg-fg mb-10 rounded-4xl flex justify-center items-center" > POST {i}</div>))}
    </div>
  )
}
