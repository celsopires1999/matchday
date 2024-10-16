"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAuth = () => setIsLoggedIn(!isLoggedIn);
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-background fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary mr-2"
                onClick={toggleMenu}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                <nav className="flex-grow">
                  <ul className="space-y-4 py-6">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block py-2 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Match Day
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              className="text-primary"
              onClick={toggleAuth}
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
