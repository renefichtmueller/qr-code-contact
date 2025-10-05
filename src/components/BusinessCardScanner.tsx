import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload, Scan, Loader2 } from 'lucide-react';
import { ContactData } from '@/pages/Index';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface BusinessCardScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataExtracted: (data: Partial<ContactData>) => void;
}

export const BusinessCardScanner = ({ open, onOpenChange, onDataExtracted }: BusinessCardScannerProps) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      console.log('Calling business card scanner function...');
      
      const { data, error } = await supabase.functions.invoke('scan-business-card', {
        body: { imageData }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to scan business card');
      }

      console.log('Extracted data:', data.data);

      // Map the extracted data to ContactData format
      const contactData: Partial<ContactData> = {
        name: data.data.name || '',
        title: data.data.title || '',
        company: data.data.company || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        website: data.data.website || '',
        address: data.data.address || '',
      };

      onDataExtracted(contactData);
      onOpenChange(false);
      setPreviewImage(null);

      toast({
        title: t('toasts.profileSaved'),
        description: 'Visitenkarten-Daten erfolgreich extrahiert!',
      });
    } catch (error) {
      console.error('Error scanning business card:', error);
      toast({
        title: 'Scan fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Fehler beim Scannen der Visitenkarte',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ungültiger Dateityp',
        description: 'Bitte wählen Sie ein Bild aus',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreviewImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (previewImage) {
      processImage(previewImage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            Visitenkarte scannen
          </DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-primary-soft/30 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Fotografieren oder laden Sie eine Visitenkarte hoch. Die KI extrahiert automatisch alle Kontaktdaten.
          </p>
        </Card>

        <div className="space-y-4">
          {previewImage ? (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Business Card Preview"
                  className="w-full h-auto rounded-lg border-2 border-border"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreviewImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (cameraInputRef.current) cameraInputRef.current.value = '';
                  }}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Anderes Bild wählen
                </Button>
                <Button
                  onClick={handleScan}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gescannt...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Jetzt scannen
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-32 flex flex-col gap-2"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-8 w-8" />
                <span>Foto aufnehmen</span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </Button>

              <Button
                variant="outline"
                className="h-32 flex flex-col gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8" />
                <span>Bild hochladen</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
