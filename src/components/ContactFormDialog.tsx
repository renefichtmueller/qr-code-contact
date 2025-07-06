import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, User, Building2, Phone } from 'lucide-react';
import { 
  sanitizeString, 
  validateEmail, 
  sanitizePhoneNumber,
  validateTextLength,
  sanitizeFormData 
} from '@/lib/security';

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
    let sanitizedValue = value;
    
    // Apply field-specific sanitization
    switch (field) {
      case 'name':
      case 'company':
      case 'title':
        sanitizedValue = sanitizeString(value, 100);
        break;
      case 'email':
        sanitizedValue = sanitizeString(value, 254);
        break;
      case 'phone':
        sanitizedValue = sanitizePhoneNumber(value);
        break;
      case 'message':
        sanitizedValue = sanitizeString(value, 1000);
        break;
      default:
        sanitizedValue = sanitizeString(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
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
    // Sanitize all form data before validation
    const sanitizedData = sanitizeFormData(formData);
    
    // Enhanced validation
    if (!sanitizedData.name || !sanitizedData.email) {
      toast({
        title: "Fehlerhafte Eingabe",
        description: "Name und E-Mail sind Pflichtfelder.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate text lengths
    if (!validateTextLength(sanitizedData.name, 100) || 
        !validateTextLength(sanitizedData.email, 254) ||
        !validateTextLength(sanitizedData.message, 1000)) {
      toast({
        title: "Eingabe zu lang",
        description: "Bitte kürzen Sie Ihre Eingaben.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use sanitized data for email content
      const subject = `Neue Kontaktanfrage von ${sanitizedData.name}`;
      const body = `Hallo,

${sanitizedData.name} möchte seine Kontaktdaten mit Ihnen teilen:

Name: ${sanitizedData.name}
E-Mail: ${sanitizedData.email}
Telefon: ${sanitizedData.phone || 'Nicht angegeben'}
Firma: ${sanitizedData.company || 'Nicht angegeben'}
Position: ${sanitizedData.title || 'Nicht angegeben'}

${sanitizedData.message ? `Nachricht:\n${sanitizedData.message}` : ''}

Viele Grüße,
${sanitizedData.name}`;

      // Open email client with sanitized data
      const mailtoUrl = `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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