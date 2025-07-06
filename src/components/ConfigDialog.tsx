import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
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