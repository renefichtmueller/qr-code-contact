import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCard } from '@/components/ProfileCard';
import { SharingOptions } from '@/components/SharingOptions';
import { ConfigDialog } from '@/components/ConfigDialog';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { BusinessCardScanner } from '@/components/BusinessCardScanner';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Settings, Share2, UserPlus, Scan, User, Zap } from 'lucide-react';
import { safeJSONParse } from '@/lib/security';
import { useTranslation } from 'react-i18next';
import { ContactData } from './Index';

const Mobile = () => {
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
    customColor: '#a855f7'
  });

  const [showConfig, setShowConfig] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

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
        customColor: '#a855f7'
      };
      const parsedData = safeJSONParse(saved, defaultData);
      setContactData(parsedData);
    }
  }, []);

  useEffect(() => {
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
      companyLogo: prev.companyLogo
    }));
    setShowConfig(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-soft via-background to-secondary flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-none p-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <Badge variant="secondary" className="mt-1 text-xs">
              {t('app.badge')}
            </Badge>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Scrollable Tabs Content */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <Tabs defaultValue="profile" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 flex-none mb-2">
            <TabsTrigger value="profile" className="text-xs">
              <User className="h-4 w-4 mr-1" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">
              <Zap className="h-4 w-4 mr-1" />
              Aktionen
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="profile" className="mt-0 h-full">
              <ProfileCard contactData={contactData} />
            </TabsContent>

            <TabsContent value="actions" className="mt-0 space-y-3">
              <Card className="p-4 shadow-[var(--shadow-card)]">
                <h3 className="text-lg font-semibold mb-3">{t('actions.title')}</h3>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowSharing(true)}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all"
                    size="sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('actions.shareContact')}
                  </Button>

                  <Button 
                    onClick={() => setShowScanner(true)}
                    variant="outline"
                    className="w-full border-primary/50 hover:bg-primary-soft"
                    size="sm"
                  >
                    <Scan className="mr-2 h-4 w-4" />
                    Visitenkarte scannen
                  </Button>

                  <Button 
                    onClick={() => setShowConfig(true)}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t('actions.editProfile')}
                  </Button>

                  <Button 
                    onClick={() => setShowContactForm(true)}
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('actions.requestContact')}
                  </Button>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-primary-soft to-secondary">
                <h4 className="font-semibold mb-2 text-sm">{t('sharing.title')}</h4>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">{t('sharing.methods.qrCode')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('sharing.methods.email')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('sharing.methods.sms')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('sharing.methods.bluetooth')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('sharing.methods.nfc')}</Badge>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
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
  );
};

export default Mobile;
