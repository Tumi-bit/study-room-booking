'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Studienraum-Buchung
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className={`${pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Startseite
          </Link>
          
          {status === 'authenticated' && session ? (
            <>
              <Link 
                href="/my-bookings" 
                className={`${pathname === '/my-bookings' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Meine Buchungen
              </Link>
              
              <div className="flex items-center ml-4">
                <span className="text-sm mr-4">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  Abmelden
                </Button>
              </div>
            </>
          ) : (
            // Replace this entire else block with the new code
            <div className="flex items-center space-x-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => signIn()}
              >
                Anmelden
              </Button>
              <Link 
                href="/auth/register" 
                className="text-gray-300 hover:text-white"
              >
                Registrieren
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;