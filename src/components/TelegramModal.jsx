import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const TelegramModal = ({ open, onOpenChange, onSave, loading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    // International validation: starts with '+', followed by digits.
    const phoneRegex = /^\+[0-9]{7,}$/; // Must start with + and have at least 7 digits
    if (!phoneRegex.test(phone)) {
      setError('Geçersiz format. Numara "+" ile başlamalı ve en az 7 rakam içermelidir (Örn: +1234567).');
      return;
    }
    setError('');
    onSave(phone);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // Only allow closing via buttons, not by clicking outside or pressing Esc
      return;
    }
    onOpenChange(isOpen);
  };
  
  const closeManually = () => {
    setPhone('');
    setError('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="bg-gray-900 border-yellow-500/30 text-white sm:max-w-[425px]"
        onInteractOutside={(e) => {
          // Prevent closing on clicking outside of the modal
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="gold-text">Önemli Adım: Telegram Numaranız</DialogTitle>
          <DialogDescription className="text-gray-400">
            Abonelik avantajlarından yararlanabilmeniz için Telegram numaranızı girmeniz gerekmektedir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telegram-phone" className="text-right text-gray-300">
              Telefon
            </Label>
            <Input
              id="telegram-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="col-span-3 bg-gray-800 border-gray-700 focus:ring-yellow-500 text-white"
            />
          </div>
          {error && <p className="col-span-4 text-center text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-between gap-2 flex-col-reverse sm:flex-row">
           <Button
            variant="outline"
            onClick={closeManually}
            className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Daha Sonra Hatırlat
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !phone}
            className="w-full sm:w-auto gold-gradient text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kaydet ve Devam Et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramModal;