export function getRelativeTime(date: Date): string {
  const now = new Date();
  const then = new Date(date);

  if (Number.isNaN(then.getTime())) return "nieznana data";

  const diff = now.getTime() - then.getTime();

  if (diff < 0) return "za chwilę";

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s temu`;

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}min temu`;

  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h temu`;

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThen = new Date(then.getFullYear(), then.getMonth(), then.getDate());

  const days = Math.floor(
    (startToday.getTime() - startThen.getTime()) / 86_400_000,
  );

  if (days < 30) return `${days} dni temu`;

  let months =
    (now.getFullYear() - then.getFullYear()) * 12 +
    now.getMonth() -
    then.getMonth();

  const anniversary = new Date(then);
  anniversary.setMonth(anniversary.getMonth() + months);

  if (anniversary > now) months--;

  if (months < 12) return `${months} ${months === 1 ? "miesiąc" : "miesiące"} temu`;

  let years = now.getFullYear() - then.getFullYear();

  const yearAnniversary = new Date(then);
  yearAnniversary.setFullYear(yearAnniversary.getFullYear() + years);

  if (yearAnniversary > now) years--;

  return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"} temu`;
}