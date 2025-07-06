import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { QrCode, Mail, Share2, Bluetooth, Nfc } from 'lucide-react';
import { ContactData } from '@/pages/Index';
import QRCode from 'qrcode';

interface SharingOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactData;
}

export const SharingOptions = ({ open, onOpenChange, contactData }: SharingOptionsProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate vCard data
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

  // Generate QR Code
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
    const subject = `Kontaktdaten von ${contactData.name}`;
    const body = `Hier sind meine Kontaktdaten:

Name: ${contactData.name}
Position: ${contactData.title}
Firma: ${contactData.company}
E-Mail: ${contactData.email}
Telefon: ${contactData.phone}
Website: ${contactData.website}
Adresse: ${contactData.address}

Viele Grüße,
${contactData.name}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    toast({
      title: "E-Mail geöffnet",
      description: "E-Mail-Client wurde geöffnet."
    });
  };

  const handleShareSMS = () => {
    const message = `${contactData.name} - ${contactData.title} bei ${contactData.company}. E-Mail: ${contactData.email}, Tel: ${contactData.phone}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    toast({
      title: "SMS geöffnet",
      description: "SMS-App wurde geöffnet."
    });
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kontakt: ${contactData.name}`,
          text: `${contactData.name} - ${contactData.title} bei ${contactData.company}`,
          url: window.location.href
        });
        toast({
          title: "Erfolgreich geteilt",
          description: "Kontakt wurde geteilt."
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      toast({
        title: "Web Share nicht verfügbar",
        description: "Ihr Browser unterstützt das Web Share API nicht."
      });
    }
  };

  const handleNFC = () => {
    if ('NDEFWriter' in window) {
      toast({
        title: "NFC wird vorbereitet",
        description: "Halten Sie Ihr Gerät an ein NFC-fähiges Gerät."
      });
      // NFC implementation would go here
    } else {
      toast({
        title: "NFC nicht verfügbar",
        description: "Ihr Gerät unterstützt kein NFC."
      });
    }
  };

  const handleBluetooth = () => {
    if ('bluetooth' in navigator) {
      toast({
        title: "Bluetooth wird vorbereitet",
        description: "Bluetooth-Übertragung wird eingerichtet."
      });
      // Bluetooth implementation would go here
    } else {
      toast({
        title: "Bluetooth nicht verfügbar",
        description: "Ihr Browser unterstützt Web Bluetooth nicht."
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
      title: "vCard heruntergeladen",
      description: "Kontaktdatei wurde heruntergeladen."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kontakt teilen</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code */}
          <Card className="p-6 text-center">
            <div className="mb-4">
              <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">QR Code</h3>
            </div>
            {qrCodeUrl && (
              <div className="mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto rounded-lg shadow-md" />
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              Scannen Sie den QR-Code um die Kontaktdaten zu erhalten
            </p>
            <Button onClick={downloadVCard} variant="outline" size="sm">
              vCard herunterladen
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
              Per E-Mail teilen
            </Button>

            <Button 
              onClick={handleShareSMS}
              className="w-full justify-start"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Per SMS teilen
            </Button>

            <Button 
              onClick={handleWebShare}
              className="w-full justify-start"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              System-Share nutzen
            </Button>

            <Button 
              onClick={handleBluetooth}
              className="w-full justify-start"
              variant="outline"
            >
              <Bluetooth className="mr-2 h-4 w-4" />
              Via Bluetooth
              <Badge variant="secondary" className="ml-auto">
                Beta
              </Badge>
            </Button>

            <Button 
              onClick={handleNFC}
              className="w-full justify-start"
              variant="outline"
            >
              <Nfc className="mr-2 h-4 w-4" />
              Via NFC
              <Badge variant="secondary" className="ml-auto">
                Beta
              </Badge>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};