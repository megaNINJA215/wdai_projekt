import Link from "next/link";


export default function LoginButton() {
  return (
    <Link
      type="button"
      href={`/login`}
      className="h-10 w-10 sm:w-24 absolute right-[calc(10%-20px)] sm:right-[calc(10%-40px)] rounded-full text-md flex justify-center items-center bg-primary">

      {/* SVG wzięte z https://www.svgrepo.com/svg/222072/right-arrow-next */}
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:hidden block">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeWidth="4.8">
          <circle cx="12" cy="10" r="4" fill="#1a1b18"></circle>
          <path fillRule="evenodd" clipRule="evenodd" d="M18.2209 18.2462C18.2791 18.3426 18.2613 18.466 18.1795 18.5432C16.5674 20.0662 14.3928 21 12 21C9.60728 21 7.43264 20.0663 5.82057 18.5433C5.73877 18.466 5.72101 18.3427 5.77918 18.2463C6.94337 16.318 9.29215 15 12.0001 15C14.7079 15 17.0567 16.3179 18.2209 18.2462Z" fill="#1a1b18"></path>
        </g>
      </svg>
      <span className="hidden sm:block text-text-dark">Zaloguj się</span>
    </Link>
  );
};

