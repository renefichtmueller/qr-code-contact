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
    try {
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
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: t('toasts.emailClientOpened'),
        description: t('toasts.emailClientOpenedDesc')
      });
    } catch (error) {
      console.error('Error opening email client:', error);
      toast({
        title: 'Fehler',
        description: 'E-Mail-Client konnte nicht geöffnet werden',
        variant: 'destructive'
      });
    }
  };

  const handleShareSMS = () => {
    try {
      const message = `${contactData.name} - ${contactData.title} ${t('profile.company')}: ${contactData.company}. ${t('profile.email')}: ${contactData.email}, ${t('profile.phone')}: ${contactData.phone}`;
      const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = smsUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: t('toasts.smsOpened'),
        description: t('toasts.smsOpenedDesc')
      });
    } catch (error) {
      console.error('Error opening SMS app:', error);
      toast({
        title: 'Fehler',
        description: 'SMS-App konnte nicht geöffnet werden',
        variant: 'destructive'
      });
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        const vCard = generateVCard();
        await navigator.share({
          title: `${t('contactForm.title')}: ${contactData.name}`,
          text: `${contactData.name} - ${contactData.title}\n${t('profile.company')}: ${contactData.company}\n${t('profile.email')}: ${contactData.email}\n${t('profile.phone')}: ${contactData.phone}`,
        });
        toast({
          title: t('toasts.shared'),
          description: t('toasts.sharedDesc')
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: 'Fehler beim Teilen',
            description: 'Das Teilen wurde abgebrochen oder ist fehlgeschlagen',
            variant: 'destructive'
          });
        }
      }
    } else {
      toast({
        title: t('toasts.webShareNotAvailable'),
        description: t('toasts.webShareNotAvailableDesc'),
        variant: 'destructive'
      });
    }
  };

  const handleNFC = async () => {
    if ('NDEFReader' in window) {
      try {
        const vCard = generateVCard();
        // @ts-ignore - Web NFC is experimental
        const ndef = new (window as any).NDEFReader();
        await ndef.write(vCard);
        toast({
          title: 'NFC bereit',
          description: 'VCard wurde an NFC übergeben. Jetzt an ein NFC-Gerät halten.'
        });
      } catch (error) {
        console.error('NFC Error:', error);
        toast({
          title: 'NFC-Fehler',
          description: 'NFC konnte nicht verwendet werden. Bitte Berechtigungen prüfen.',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: t('toasts.nfcNotAvailable'),
        description: t('toasts.nfcNotAvailableDesc'),
        variant: 'destructive'
      });
    }
  };

  const handleBluetooth = async () => {
    if ('bluetooth' in navigator) {
      try {
        toast({
          title: 'Bluetooth nicht vollständig implementiert',
          description: 'Diese Funktion ist noch in Entwicklung. Bitte verwenden Sie eine andere Freigabemethode.',
          variant: 'destructive'
        });
      } catch (error) {
        console.error('Bluetooth Error:', error);
        toast({
          title: t('toasts.bluetoothNotAvailable'),
          description: 'Bluetooth konnte nicht aktiviert werden',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: t('toasts.bluetoothNotAvailable'),
        description: t('toasts.bluetoothNotAvailableDesc'),
        variant: 'destructive'
      });
    }
  };

  const copyContactToClipboard = async () => {
    const text = `${contactData.name}\n${contactData.title} - ${contactData.company}\n${contactData.email}\n${contactData.phone}\n${contactData.website}\n${contactData.address}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Kopiert',
        description: 'Kontaktdaten wurden in die Zwischenablage kopiert.'
      });
    } catch (error) {
      console.error('Clipboard error:', error);
      toast({
        title: 'Fehler',
        description: 'Kopieren in die Zwischenablage nicht möglich.',
        variant: 'destructive'
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
