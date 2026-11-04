import React from 'react';

export interface LoginHeaderProps {

}

export default function LoginHeader(props: LoginHeaderProps) {
  return (
    <div className="h-32 flex items-center justify-center text-4xl font-semibold shrink-0">
      Medioc<span className="text-primary font-bold">Re</span>
    </div>
  );
};