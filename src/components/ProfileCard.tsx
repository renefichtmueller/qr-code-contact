import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, MapPin, Building2 } from 'lucide-react';
import { ContactData } from '@/pages/Index';

interface ProfileCardProps {
  contactData: ContactData;
}

const templateStyles = {
  modern: {
    gradient: 'from-primary to-primary-glow',
    cardClass: 'shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300'
  },
  minimal: {
    gradient: 'from-slate-600 to-slate-800',
    cardClass: 'border-2 shadow-lg'
  },
  elegant: {
    gradient: 'from-emerald-600 to-teal-600',
    cardClass: 'shadow-xl border border-emerald-200'
  },
  bold: {
    gradient: 'from-orange-500 to-red-600',
    cardClass: 'shadow-2xl'
  }
};

export const ProfileCard = ({ contactData }: ProfileCardProps) => {
  const template = templateStyles[contactData.template as keyof typeof templateStyles] || templateStyles.modern;
  
  // Use custom color if provided
  const customStyle = contactData.customColor ? {
    background: `linear-gradient(135deg, ${contactData.customColor}, ${contactData.customColor}dd)`
  } : {};

  return (
    <Card className={`overflow-hidden ${template.cardClass}`}>
      {/* Header with gradient and company logo */}
      <div 
        className={`h-32 bg-gradient-to-r ${template.gradient} relative flex items-center justify-center`}
        style={contactData.customColor ? customStyle : {}}
      >
        <div className="absolute inset-0 bg-black/10" />
        {contactData.companyLogo && (
          <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <img 
              src={contactData.companyLogo} 
              alt={`${contactData.company} Logo`}
              className="w-20 h-12 object-contain"
            />
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="relative -mt-16 mb-4">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white mx-auto flex items-center justify-center">
            {contactData.profileImage ? (
              <img 
                src={contactData.profileImage} 
                alt={contactData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-soft to-primary flex items-center justify-center text-primary font-bold text-2xl">
                {contactData.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {contactData.name}
          </h2>
          <p className="text-primary font-medium mb-1">
            {contactData.title}
          </p>
          <Badge variant="secondary" className="mb-2">
            {contactData.company}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {contactData.email && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">{contactData.email}</span>
            </div>
          )}
          
          {contactData.phone && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">{contactData.phone}</span>
            </div>
          )}
          
          {contactData.website && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">{contactData.website}</span>
            </div>
          )}
          
          {contactData.address && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">{contactData.address}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};