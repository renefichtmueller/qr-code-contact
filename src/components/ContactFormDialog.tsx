import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, User, Building2, Phone } from 'lucide-react';

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerEmail: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  message: string;
}

export const ContactFormDialog = ({ open, onOpenChange, ownerEmail }: ContactFormDialogProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      message: ''
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Fehlerhafte Eingabe",
        description: "Name und E-Mail sind Pflichtfelder.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create email content
      const subject = `Neue Kontaktanfrage von ${formData.name}`;
      const body = `Hallo,

${formData.name} möchte seine Kontaktdaten mit Ihnen teilen:

Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone || 'Nicht angegeben'}
Firma: ${formData.company || 'Nicht angegeben'}
Position: ${formData.title || 'Nicht angegeben'}

${formData.message ? `Nachricht:\n${formData.message}` : ''}

Viele Grüße,
${formData.name}`;

      // Open email client
      const mailtoUrl = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);

      toast({
        title: "E-Mail wird geöffnet",
        description: "Ihre Kontaktdaten werden per E-Mail versendet."
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Fehler beim Senden",
        description: "Die E-Mail konnte nicht geöffnet werden.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Kontaktdaten teilen
          </DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-primary-soft/30 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Füllen Sie das Formular aus, um Ihre Kontaktdaten zu teilen. 
            Eine E-Mail mit Ihren Daten wird an <strong>{ownerEmail}</strong> gesendet.
          </p>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contactName">Name *</Label>
              <Input
                id="contactName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ihr vollständiger Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">E-Mail *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ihre.email@beispiel.de"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contactPhone">Telefon</Label>
              <Input
                id="contactPhone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+49 123 456789"
              />
            </div>
            <div>
              <Label htmlFor="contactCompany">Firma</Label>
              <Input
                id="contactCompany"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Firmenname"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactTitle">Position</Label>
            <Input
              id="contactTitle"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ihre Berufsbezeichnung"
            />
          </div>

          <div>
            <Label htmlFor="contactMessage">Nachricht (optional)</Label>
            <Textarea
              id="contactMessage"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Zusätzliche Informationen oder Nachricht..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Wird gesendet...' : 'Kontakt senden'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};