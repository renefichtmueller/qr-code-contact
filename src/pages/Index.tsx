import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/ProfileCard';
import { SharingOptions } from '@/components/SharingOptions';
import { ConfigDialog } from '@/components/ConfigDialog';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { Settings, Share2, UserPlus } from 'lucide-react';

export interface ContactData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  profileImage?: string;
  template: string;
  customColor?: string;
}

const Index = () => {
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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('contactData');
    if (saved) {
      setContactData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('contactData', JSON.stringify(contactData));
  }, [contactData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-secondary p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            Kontakt Teilen
          </h1>
          <p className="text-muted-foreground text-lg">
            Teilen Sie Ihre Kontaktdaten einfach und professionell
          </p>
          <Badge variant="secondary" className="mt-2">
            Open Source Community
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
              <h3 className="text-xl font-semibold mb-4">Aktionen</h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowSharing(true)}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Kontakt teilen
                </Button>

                <Button 
                  onClick={() => setShowConfig(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Profil bearbeiten
                </Button>

                <Button 
                  onClick={() => setShowContactForm(true)}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Gegenkontakt anfragen
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-primary-soft to-secondary">
              <h4 className="font-semibold mb-2">Verfügbare Sharing-Methoden</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">QR Code</Badge>
                <Badge variant="outline">E-Mail</Badge>
                <Badge variant="outline">SMS</Badge>
                <Badge variant="outline">Bluetooth</Badge>
                <Badge variant="outline">NFC</Badge>
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
      </div>
    </div>
  );
};

export default Index;