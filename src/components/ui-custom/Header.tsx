import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/UserContext';
import { LogOut, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-sm shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section: Logo/Title */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="font-extrabold text-2xl text-primary transition-colors duration-300 group-hover:text-accent">
            Dashboard 2.0
          </span>
        </Link>

        {/* Right section: User menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarImage src={user.avatar_url || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt={user.email || "User"} />
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-surface border-border text-text rounded-lg shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-text">{user.email}</p>
                    <p className="text-xs leading-none text-textSecondary">
                      {user.id}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer transition-colors duration-200 hover:bg-primary/20 hover:text-primary rounded-md mx-1">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer transition-colors duration-200 hover:bg-primary/20 hover:text-primary rounded-md mx-1">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={signOut} className="flex items-center px-3 py-2 cursor-pointer transition-colors duration-200 hover:bg-error/20 hover:text-error rounded-md mx-1">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" className="text-text hover:bg-primary/20 hover:text-primary transition-colors duration-200 rounded-md px-4 py-2">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
