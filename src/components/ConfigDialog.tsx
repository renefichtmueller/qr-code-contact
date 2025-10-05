import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Camera, Building2 } from 'lucide-react';
import { ContactData } from '@/pages/Index';
import { useTranslation } from 'react-i18next';
import { 
  sanitizeString, 
  validateEmail, 
  validateURL, 
  validateHexColor, 
  validateImageFile,
  sanitizePhoneNumber 
} from '@/lib/security';

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactData;
  onSave: (data: ContactData) => void;
}

export const ConfigDialog = ({ open, onOpenChange, contactData, onSave }: ConfigDialogProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactData>(contactData);

  // Update formData when contactData or dialog state changes
  useEffect(() => {
    if (open) {
      setFormData(contactData);
    }
  }, [open, contactData]);

  const templates = [
    { id: 'modern', name: t('templates.modern'), color: '#a855f7' },
    { id: 'minimal', name: t('templates.minimal'), color: '#64748b' },
    { id: 'elegant', name: t('templates.elegant'), color: '#059669' },
    { id: 'bold', name: t('templates.bold'), color: '#ea580c' }
  ];

  const handleInputChange = (field: keyof ContactData, value: string) => {
    let sanitizedValue = value;
    
    // Apply field-specific sanitization and validation
    switch (field) {
      case 'name':
      case 'title':
      case 'company':
      case 'address':
        sanitizedValue = sanitizeString(value, field === 'address' ? 200 : 100);
        break;
      case 'email':
        sanitizedValue = sanitizeString(value, 254);
        break;
      case 'phone':
        sanitizedValue = sanitizePhoneNumber(value);
        break;
      case 'website':
        sanitizedValue = sanitizeString(value, 2000);
        break;
      case 'customColor':
        if (value === '' || validateHexColor(value)) {
          sanitizedValue = value;
        } else {
          return;
        }
        break;
      default:
        sanitizedValue = sanitizeString(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: t('toasts.requiredFields'),
        description: t('toasts.requiredFieldsDesc'),
        variant: "destructive"
      });
      return;
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      toast({
        title: t('toasts.invalidEmail'),
        description: t('toasts.invalidEmailDesc'),
        variant: "destructive"
      });
      return;
    }
    
    if (formData.website && formData.website !== '' && !validateURL(formData.website)) {
      toast({
        title: t('toasts.invalidWebsite'),
        description: t('toasts.invalidWebsiteDesc'),
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData);
    onOpenChange(false);
    toast({
      title: t('toasts.profileSaved'),
      description: t('toasts.profileSavedDesc')
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({ ...prev, template: templateId }));
  };

  const handleColorChange = (color: string) => {
    if (color === '' || validateHexColor(color)) {
      setFormData(prev => ({ ...prev, customColor: color }));
    }
  };

  const handleImageUpload = (field: 'profileImage' | 'companyLogo', file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: t('toasts.invalidFile'),
        description: validation.error || t('toasts.invalidFileDesc'),
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: result }));
      toast({
        title: t('toasts.imageUploaded'),
        description: t('toasts.imageUploadedDesc', { type: field === 'profileImage' ? t('profile.profileImage') : t('profile.companyLogo') })
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (field: 'profileImage' | 'companyLogo') => {
    setFormData(prev => ({ ...prev, [field]: undefined }));
    toast({
      title: t('toasts.imageRemoved'),
      description: t('toasts.imageRemovedDesc', { type: field === 'profileImage' ? t('profile.profileImage') : t('profile.companyLogo') })
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onKeyDown={(e) => {
          // Prevent dialog from interfering with spacebar in input fields
          if (e.key === ' ') {
            const target = e.target as HTMLElement;
            if (
              target instanceof HTMLInputElement || 
              target instanceof HTMLTextAreaElement ||
              target.isContentEditable
            ) {
              e.stopPropagation();
            }
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('profile.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('profile.personalData')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">{t('profile.name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('profile.placeholders.name')}
                />
              </div>
              <div>
                <Label htmlFor="title">{t('profile.title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={t('profile.placeholders.title')}
                />
              </div>
              <div>
                <Label htmlFor="company">{t('profile.company')}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder={t('profile.placeholders.company')}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('profile.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('profile.placeholders.email')}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('profile.placeholders.phone')}
                />
              </div>
              <div>
                <Label htmlFor="website">{t('profile.website')}</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder={t('profile.placeholders.website')}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="address">{t('profile.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={t('profile.placeholders.address')}
              />
            </div>
          </Card>

          {/* Image Uploads */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('profile.images')}</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Image */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Camera className="h-4 w-4" />
                  {t('profile.profileImage')}
                </Label>
                <div className="space-y-3">
                  {formData.profileImage ? (
                    <div className="relative">
                      <img 
                        src={formData.profileImage} 
                        alt={t('profile.profileImage')}
                        className="w-24 h-24 rounded-full object-cover border-2 border-border mx-auto"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage('profileImage')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-border mx-auto flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profileImageInput')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {formData.profileImage ? t('actions.change') : t('actions.upload')}
                    </Button>
                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('profileImage', file);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Company Logo */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4" />
                  {t('profile.companyLogo')}
                </Label>
                <div className="space-y-3">
                  {formData.companyLogo ? (
                    <div className="relative">
                      <img 
                        src={formData.companyLogo} 
                        alt={t('profile.companyLogo')}
                        className="w-24 h-24 rounded-lg object-contain border-2 border-border mx-auto bg-white p-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage('companyLogo')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border mx-auto flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('companyLogoInput')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {formData.companyLogo ? t('actions.change') : t('actions.upload')}
                    </Button>
                    <input
                      id="companyLogoInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('companyLogo', file);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {t('profile.supportedFormats')}
            </p>
          </Card>

          {/* Template Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('profile.templateSelection')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant={formData.template === template.id ? "default" : "outline"}
                  className="h-20 flex-col space-y-2"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: template.color }}
                  />
                  <span className="text-xs">{template.name}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Custom Color */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('profile.customColor')}</h3>
            <div className="flex gap-3 items-center">
              <div>
                <Label htmlFor="customColor">{t('profile.hexColor')}</Label>
                <Input
                  id="customColor"
                  value={formData.customColor || ''}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder={t('profile.placeholders.hexColor')}
                  className="w-32"
                />
              </div>
              <div 
                className="w-12 h-12 rounded-lg border-2 border-border"
                style={{ backgroundColor: formData.customColor || '#a855f7' }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('profile.colorDescription')}
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('actions.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
