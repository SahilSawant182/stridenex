"use client";

import React from 'react';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function FloatingSignupButton() {
  return (
    <Link
      href="/signup"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-orange-500 text-white shadow-[0_4px_12px_rgba(241,90,41,0.3)] hover:bg-orange-600 hover:shadow-[0_6px_16px_rgba(241,90,41,0.4)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex justify-center items-center"
      aria-label="Join Now"
      title="Join Now"
    >
      <UserPlus size={20} />
    </Link>
  );
}
