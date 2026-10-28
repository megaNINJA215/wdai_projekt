import { Suspense } from 'react';
import Searchbar from '../../navigation/Searchbar';
import { UserButton } from './components/UserButton';

export default async function Header() {
  return (
    <div className="w-full h-22 flex items-center justify-center fixed top-0 left-0 z-10 bg-linear-to-b from-bg via-bg to-transparent">
      <Suspense fallback={<div className="h-10 w-3/5" />}>
        <Searchbar />
      </Suspense>
      <Suspense fallback={<div className="h-10 w-10 sm:w-20" />}>
        <UserButton />
      </Suspense>
    </div>
  );
};