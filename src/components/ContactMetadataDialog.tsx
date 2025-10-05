import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Tag, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tags: string[], notes: string) => void;
  firstName: string;
  lastName: string;
}

const SUGGESTED_TAGS = [
  'Event',
  'Meeting',
  'Konferenz',
  'Messe',
  'Workshop',
  'Networking',
  'Geschäftspartner',
  'Kunde',
  'Lieferant',
  'Investor'
];

export const ContactMetadataDialog = ({ open, onOpenChange, onSave, firstName, lastName }: ContactMetadataDialogProps) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    onSave(tags, notes);
    // Reset form
    setTags([]);
    setNotes('');
    setTagInput('');
    onOpenChange(false);

    // Send notification email
    try {
      const { error } = await supabase.functions.invoke('send-contact-notification', {
        body: { 
          firstName,
          lastName
        }
      });

      if (error) {
        console.error('Error sending notification:', error);
        toast.error('Fehler beim Senden der Benachrichtigung');
      } else {
        console.log('Notification sent successfully');
      }
    } catch (error) {
      console.error('Error invoking function:', error);
    }
  };

  const handleCancel = () => {
    setTags([]);
    setNotes('');
    setTagInput('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Kontakt kategorisieren
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tags Section */}
          <div>
            <Label className="text-base font-semibold mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Schlagworte
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Fügen Sie Schlagworte hinzu, um den Kontakt einfach wiederzufinden
            </p>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-primary-soft/30 rounded-lg">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Vorschläge:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleAddTag(tag)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="Eigenes Schlagwort eingeben..."
                className="flex-1"
              />
              <Button
                onClick={() => handleAddTag(tagInput)}
                disabled={!tagInput.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold mb-2 block">
              Bemerkungen
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Notieren Sie wichtige Informationen oder Gesprächsthemen
            </p>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z.B. Interessiert an Produkt X, Follow-up im Q2 vereinbart..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-primary-glow"
            >
              {t('actions.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
