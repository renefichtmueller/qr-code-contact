import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { SharingOptions } from '@/components/SharingOptions';
import { ConfigDialog } from '@/components/ConfigDialog';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { BusinessCardScanner } from '@/components/BusinessCardScanner';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Settings, Share2, UserPlus, Scan } from 'lucide-react';
import { safeJSONParse } from '@/lib/security';
import { useTranslation } from 'react-i18next';

export interface ContactData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  profileImage?: string;
  companyLogo?: string;
  template: string;
  customColor?: string;
  tags?: string[];
  notes?: string;
  colors?: {
    header?: string;
    icons?: string;
    text?: string;
    badges?: string;
    hover?: string;
  };
}

const Index = () => {
  const { t } = useTranslation();
  const [contactData, setContactData] = useState<ContactData>({
    name: 'Max Mustermann',
    title: 'Senior Developer',
    company: 'TechCorp GmbH',
    email: 'max.mustermann@techcorp.de',
    phone: '+49 123 456789',
    website: 'https://techcorp.de',
    address: 'Musterstraße 123, 12345 Berlin',
    template: 'modern',
    customColor: '#a855f7',
    tags: [],
    notes: ''
  });

  const [showConfig, setShowConfig] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Load from localStorage on mount with safe parsing
  useEffect(() => {
    const saved = localStorage.getItem('contactData');
    if (saved) {
      const defaultData: ContactData = {
        name: 'Max Mustermann',
        title: 'Senior Developer',
        company: 'TechCorp GmbH',
        email: 'max.mustermann@techcorp.de',
        phone: '+49 123 456789',
        website: 'https://techcorp.de',
        address: 'Musterstraße 123, 12345 Berlin',
        template: 'modern',
        customColor: '#a855f7',
        tags: [],
        notes: ''
      };
      const parsedData = safeJSONParse(saved, defaultData);
      setContactData(parsedData);
    }
  }, []);

  // Save to localStorage when data changes with basic validation
  useEffect(() => {
    // Basic validation before saving
    if (contactData.name && contactData.email) {
      localStorage.setItem('contactData', JSON.stringify(contactData));
    }
  }, [contactData]);

  const handleScannerData = (scannedData: Partial<ContactData>) => {
    setContactData(prev => ({
      ...prev,
      ...scannedData,
      template: prev.template,
      customColor: prev.customColor,
      profileImage: prev.profileImage,
      companyLogo: prev.companyLogo,
      // Merge tags if they exist
      tags: scannedData.tags || prev.tags || [],
      // Keep notes from scanned data
      notes: scannedData.notes || prev.notes || ''
    }));
    setShowConfig(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-secondary p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            {t('app.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('app.subtitle')}
          </p>
          <Badge variant="secondary" className="mt-2">
            {t('app.badge')}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Card */}
          <div className="space-y-4">
            <ProfileCard contactData={contactData} />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Card className="p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-semibold mb-4">{t('actions.title')}</h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowSharing(true)}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  {t('actions.shareContact')}
                </Button>

                <Button 
                  onClick={() => setShowConfig(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  {t('actions.editProfile')}
                </Button>

                <Button 
                  onClick={() => setShowContactForm(true)}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t('actions.requestContact')}
                </Button>

                <Button 
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary-soft"
                  size="lg"
                >
                  <Scan className="mr-2 h-5 w-5" />
                  Visitenkarte scannen
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-primary-soft to-secondary">
              <h4 className="font-semibold mb-2">{t('sharing.title')}</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSharing(true)}>{t('sharing.methods.qrCode')}</Button>
                <Button variant="outline" size="sm" onClick={() => setShowSharing(true)}>{t('sharing.methods.email')}</Button>
                <Button variant="outline" size="sm" onClick={() => setShowSharing(true)}>{t('sharing.methods.sms')}</Button>
                <Button variant="outline" size="sm" onClick={() => setShowSharing(true)}>{t('sharing.methods.bluetooth')}</Button>
                <Button variant="outline" size="sm" onClick={() => setShowSharing(true)}>{t('sharing.methods.nfc')}</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Dialogs */}
        <ConfigDialog 
          open={showConfig} 
          onOpenChange={setShowConfig}
          contactData={contactData}
          onSave={setContactData}
        />
        
        <SharingOptions 
          open={showSharing} 
          onOpenChange={setShowSharing}
          contactData={contactData}
        />
        
        <ContactFormDialog 
          open={showContactForm} 
          onOpenChange={setShowContactForm}
          ownerEmail={contactData.email}
        />

        <BusinessCardScanner
          open={showScanner}
          onOpenChange={setShowScanner}
          onDataExtracted={handleScannerData}
        />
      </div>
    </div>
  );
};

export default Index;