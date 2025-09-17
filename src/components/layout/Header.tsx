import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Products", href: "#products" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact Us", href: "#contact" },
];

export function Header() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight">
          Jemputanku
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-blue-700 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex gap-2 items-center">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
            <Link href="#pricing">Bergabung</Link>
          </Button>
        </div>
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b font-bold text-xl text-blue-700">Jemputanku</div>
                <nav className="flex flex-col gap-2 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-gray-700 hover:text-blue-700 font-medium py-2 px-2 rounded transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-4 flex gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" asChild>
                    <Link href="#pricing">Bergabung</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
