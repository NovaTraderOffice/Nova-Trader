
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/Dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { User, LogIn, LogOut, Package } from 'lucide-react';
import { useToast } from './ui/use-toast';

const ProfileButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-yellow-600/50">
            <AvatarFallback className="bg-gray-800 text-yellow-500 font-bold">
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-black/80 backdrop-blur-sm border-yellow-600/30 text-white" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none gold-text">
                  Kullanıcı
                </p>
                <p className="text-xs leading-none text-gray-400">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-yellow-600/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => navigate('/urunlerim')} className="cursor-pointer focus:bg-yellow-600/20">
                <Package className="mr-2 h-4 w-4" />
                <span>Ürünlerim</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-yellow-600/20" />
            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer focus:bg-yellow-600/20 focus:text-red-400 text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onSelect={() => navigate('/giris')} className="cursor-pointer focus:bg-yellow-600/20">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Giriş Yap / Kayıt Ol</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
