import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Camera, Building2 } from 'lucide-react';
import { ContactData } from '@/pages/Index';

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactData;
  onSave: (data: ContactData) => void;
}

const templates = [
  { id: 'modern', name: 'Modern', color: '#a855f7' },
  { id: 'minimal', name: 'Minimal', color: '#64748b' },
  { id: 'elegant', name: 'Elegant', color: '#059669' },
  { id: 'bold', name: 'Bold', color: '#ea580c' }
];

export const ConfigDialog = ({ open, onOpenChange, contactData, onSave }: ConfigDialogProps) => {
  const [formData, setFormData] = useState<ContactData>(contactData);

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
    toast({
      title: "Profil gespeichert",
      description: "Ihre Kontaktdaten wurden erfolgreich aktualisiert."
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({ ...prev, template: templateId }));
  };

  const handleColorChange = (color: string) => {
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      setFormData(prev => ({ ...prev, customColor: color }));
    }
  };

  const handleImageUpload = (field: 'profileImage' | 'companyLogo', file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Datei zu groß",
        description: "Bitte wählen Sie eine Datei unter 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: result }));
      toast({
        title: "Bild hochgeladen",
        description: `${field === 'profileImage' ? 'Profilbild' : 'Firmenlogo'} wurde erfolgreich hochgeladen.`
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (field: 'profileImage' | 'companyLogo') => {
    setFormData(prev => ({ ...prev, [field]: undefined }));
    toast({
      title: "Bild entfernt",
      description: `${field === 'profileImage' ? 'Profilbild' : 'Firmenlogo'} wurde entfernt.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil bearbeiten</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Persönliche Daten</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <Label htmlFor="title">Position</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ihre Berufsbezeichnung"
                />
              </div>
              <div>
                <Label htmlFor="company">Firma</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Firmenname"
                />
              </div>
              <div>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://ihre-website.de"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Straße, PLZ Ort"
              />
            </div>
          </Card>

          {/* Image Uploads */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Bilder</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Image */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Camera className="h-4 w-4" />
                  Profilbild
                </Label>
                <div className="space-y-3">
                  {formData.profileImage ? (
                    <div className="relative">
                      <img 
                        src={formData.profileImage} 
                        alt="Profilbild Preview"
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
                      {formData.profileImage ? 'Ändern' : 'Hochladen'}
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
                  Firmenlogo
                </Label>
                <div className="space-y-3">
                  {formData.companyLogo ? (
                    <div className="relative">
                      <img 
                        src={formData.companyLogo} 
                        alt="Firmenlogo Preview"
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
                      {formData.companyLogo ? 'Ändern' : 'Hochladen'}
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
              Unterstützte Formate: JPG, PNG, GIF (max. 5MB)
            </p>
          </Card>

          {/* Template Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Design-Vorlage wählen</h3>
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
            <h3 className="font-semibold mb-4">Benutzerdefinierte Farbe</h3>
            <div className="flex gap-3 items-center">
              <div>
                <Label htmlFor="customColor">Hex-Farbe</Label>
                <Input
                  id="customColor"
                  value={formData.customColor || ''}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#a855f7"
                  className="w-32"
                />
              </div>
              <div 
                className="w-12 h-12 rounded-lg border-2 border-border"
                style={{ backgroundColor: formData.customColor || '#a855f7' }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Geben Sie eine Hex-Farbe ein (z.B. #a855f7) um das Design zu personalisieren
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};