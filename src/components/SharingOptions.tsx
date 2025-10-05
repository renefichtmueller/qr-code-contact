import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { QrCode, Mail, Share2, Bluetooth, Nfc } from 'lucide-react';
import { ContactData } from '@/pages/Index';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

interface SharingOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactData;
}

export const SharingOptions = ({ open, onOpenChange, contactData }: SharingOptionsProps) => {
  const { t } = useTranslation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
ORG:${contactData.company}
TITLE:${contactData.title}
EMAIL:${contactData.email}
TEL:${contactData.phone}
URL:${contactData.website}
ADR:;;${contactData.address};;;;
END:VCARD`;
  };

  useEffect(() => {
    if (open) {
      const vCard = generateVCard();
      QRCode.toDataURL(vCard, {
        width: 256,
        margin: 2,
        color: {
          dark: '#a855f7',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl);
    }
  }, [open, contactData]);

  const handleShareEmail = () => {
    const subject = `${t('contactForm.title')} ${contactData.name}`;
    const body = `${t('app.title')}:

${t('profile.name')}: ${contactData.name}
${t('profile.title')}: ${contactData.title}
${t('profile.company')}: ${contactData.company}
${t('profile.email')}: ${contactData.email}
${t('profile.phone')}: ${contactData.phone}
${t('profile.website')}: ${contactData.website}
${t('profile.address')}: ${contactData.address}

${contactData.name}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    toast({
      title: t('toasts.emailClientOpened'),
      description: t('toasts.emailClientOpenedDesc')
    });
  };

  const handleShareSMS = () => {
    const message = `${contactData.name} - ${contactData.title} ${t('profile.company')}: ${contactData.company}. ${t('profile.email')}: ${contactData.email}, ${t('profile.phone')}: ${contactData.phone}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    toast({
      title: t('toasts.smsOpened'),
      description: t('toasts.smsOpenedDesc')
    });
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t('contactForm.title')}: ${contactData.name}`,
          text: `${contactData.name} - ${contactData.title} ${t('profile.company')}: ${contactData.company}`,
          url: window.location.href
        });
        toast({
          title: t('toasts.shared'),
          description: t('toasts.sharedDesc')
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      toast({
        title: t('toasts.webShareNotAvailable'),
        description: t('toasts.webShareNotAvailableDesc')
      });
    }
  };

  const handleNFC = () => {
    if ('NDEFWriter' in window) {
      toast({
        title: t('toasts.nfcPreparing'),
        description: t('toasts.nfcPreparingDesc')
      });
    } else {
      toast({
        title: t('toasts.nfcNotAvailable'),
        description: t('toasts.nfcNotAvailableDesc')
      });
    }
  };

  const handleBluetooth = () => {
    if ('bluetooth' in navigator) {
      toast({
        title: t('toasts.bluetoothPreparing'),
        description: t('toasts.bluetoothPreparingDesc')
      });
    } else {
      toast({
        title: t('toasts.bluetoothNotAvailable'),
        description: t('toasts.bluetoothNotAvailableDesc')
      });
    }
  };

  const downloadVCard = () => {
    const vCard = generateVCard();
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contactData.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('toasts.vCardDownloaded'),
      description: t('toasts.vCardDownloadedDesc')
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('sharingDialog.title')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code */}
          <Card className="p-6 text-center">
            <div className="mb-4">
              <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">{t('sharingDialog.qrCodeTitle')}</h3>
            </div>
            {qrCodeUrl && (
              <div className="mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto rounded-lg shadow-md" />
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              {t('sharingDialog.qrCodeDescription')}
            </p>
            <Button onClick={downloadVCard} variant="outline" size="sm">
              {t('sharingDialog.downloadVCard')}
            </Button>
          </Card>

          {/* Sharing Options */}
          <div className="space-y-3">
            <Button 
              onClick={handleShareEmail}
              className="w-full justify-start"
              variant="outline"
            >
              <Mail className="mr-2 h-4 w-4" />
              {t('sharingDialog.shareEmail')}
            </Button>

            <Button 
              onClick={handleShareSMS}
              className="w-full justify-start"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t('sharingDialog.shareSMS')}
            </Button>

            <Button 
              onClick={handleWebShare}
              className="w-full justify-start"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t('sharingDialog.shareSystem')}
            </Button>

            <Button 
              onClick={handleBluetooth}
              className="w-full justify-start"
              variant="outline"
            >
              <Bluetooth className="mr-2 h-4 w-4" />
              {t('sharingDialog.shareBluetooth')}
              <Badge variant="secondary" className="ml-auto">
                {t('sharingDialog.beta')}
              </Badge>
            </Button>

            <Button 
              onClick={handleNFC}
              className="w-full justify-start"
              variant="outline"
            >
              <Nfc className="mr-2 h-4 w-4" />
              {t('sharingDialog.shareNFC')}
              <Badge variant="secondary" className="ml-auto">
                {t('sharingDialog.beta')}
              </Badge>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
