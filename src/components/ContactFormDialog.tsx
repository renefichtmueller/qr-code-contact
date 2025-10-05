import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    const sanitizedData = sanitizeFormData(formData);
    
    if (!sanitizedData.name || !sanitizedData.email) {
      toast({
        title: t('toasts.requiredFields'),
        description: t('toasts.requiredFieldsDesc'),
        variant: "destructive"
      });
      return;
    }
    
    if (!validateTextLength(sanitizedData.name, 100) || 
        !validateTextLength(sanitizedData.email, 254) ||
        !validateTextLength(sanitizedData.message, 1000)) {
      toast({
        title: t('toasts.inputTooLong'),
        description: t('toasts.inputTooLongDesc'),
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEmail(sanitizedData.email)) {
      toast({
        title: t('toasts.invalidEmail'),
        description: t('toasts.invalidEmailDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subject = `${t('contactForm.title')} ${sanitizedData.name}`;
      const body = `${t('app.title')}

${sanitizedData.name}

${t('profile.name')}: ${sanitizedData.name}
${t('profile.email')}: ${sanitizedData.email}
${t('profile.phone')}: ${sanitizedData.phone || '-'}
${t('profile.company')}: ${sanitizedData.company || '-'}
${t('profile.title')}: ${sanitizedData.title || '-'}

${sanitizedData.message ? `${t('contactForm.message')}:\n${sanitizedData.message}` : ''}

${sanitizedData.name}`;

      const mailtoUrl = `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);

      toast({
        title: t('toasts.emailOpened'),
        description: t('toasts.emailOpenedDesc')
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t('toasts.sendError'),
        description: t('toasts.sendErrorDesc'),
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
            {t('contactForm.title')}
          </DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-primary-soft/30 border-primary/20">
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ 
            __html: t('contactForm.description', { email: ownerEmail }) 
          }} />
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contactName">{t('profile.name')} *</Label>
              <Input
                id="contactName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('profile.placeholders.name')}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">{t('profile.email')} *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('profile.placeholders.email')}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contactPhone">{t('profile.phone')}</Label>
              <Input
                id="contactPhone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('profile.placeholders.phone')}
              />
            </div>
            <div>
              <Label htmlFor="contactCompany">{t('profile.company')}</Label>
              <Input
                id="contactCompany"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder={t('profile.placeholders.company')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactTitle">{t('profile.title')}</Label>
            <Input
              id="contactTitle"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('profile.placeholders.title')}
            />
          </div>

          <div>
            <Label htmlFor="contactMessage">{t('contactForm.message')}</Label>
            <Textarea
              id="contactMessage"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t('contactForm.placeholders.message')}
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
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? t('actions.sending') : t('actions.send')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
