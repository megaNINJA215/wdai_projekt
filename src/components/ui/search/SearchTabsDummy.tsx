const tabs = ["posts", "communities", "users"] as const;

export default function SearchTabsDummy() {
  function translateTab(tab: (typeof tabs)[number]): string {
    switch (tab) {
      case "posts":
        return "Posty";
      case "communities":
        return "Społeczności";
      case "users":
        return "Użytkownicy";
    }
  }
  return (
    <div className="absolute left-0 w-full flex items-center justify-center">

      <div className="z-9 w-full h-6 -translate-y-4 max-w-220">
        <div className="w-full pt-20 -translate-y-20" >
          <div className="relative flex gap-8 justify-between w-2/5 m-auto min-w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`relative pb-3 text-md font-bold capitalize transition-colors duration-200 ${"posts" === tab
                  ? "text-primary-hover"
                  : "text-primary-muted hover:text-primary"
                  }`}
              >
                {translateTab(tab)}
                {"posts" === tab && (
                  <span className="absolute bottom-2 -left-2.5 -right-2.5 h-1 rounded-full bg-border" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="h-8 w-full bg-linear-to-b from-bg via-bg to-transparent -translate-y-22" />
      </div>
    </div>
  );
}