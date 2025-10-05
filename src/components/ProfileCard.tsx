import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, MapPin, Building2, Tag, StickyNote, Linkedin, Facebook, Twitter, MessageCircle } from 'lucide-react';
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
  
  // Use custom colors if provided
  const headerColor = contactData.colors?.header || contactData.customColor;
  const iconColor = contactData.colors?.icons;
  const textColor = contactData.colors?.text;
  const badgeColor = contactData.colors?.badges;
  const hoverColor = contactData.colors?.hover;
  
  const customStyle = headerColor ? {
    background: `linear-gradient(135deg, ${headerColor}, ${headerColor}dd)`
  } : {};

  return (
    <Card className={`overflow-hidden ${template.cardClass}`}>
      {/* Header with gradient */}
      <div 
        className={`h-32 bg-gradient-to-r ${template.gradient} relative`}
        style={headerColor ? customStyle : {}}
      >
        <div className="absolute inset-0 bg-black/10" />
        {/* Company logo positioned top right */}
        {contactData.companyLogo && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <img 
              src={contactData.companyLogo} 
              alt={`${contactData.company} Logo`}
              className="w-16 h-10 object-contain"
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
              <div 
                className="w-full h-full rounded-full bg-gradient-to-br from-primary-soft to-primary flex items-center justify-center text-primary font-bold text-2xl"
                style={headerColor ? { 
                  background: `linear-gradient(135deg, ${headerColor}22, ${headerColor})`,
                  color: headerColor 
                } : {}}
              >
                {contactData.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold text-foreground mb-1"
            style={textColor ? { color: textColor } : {}}
          >
            {contactData.name}
          </h2>
          <p 
            className="text-primary font-medium mb-1"
            style={textColor ? { color: textColor } : {}}
          >
            {contactData.title}
          </p>
          <Badge 
            variant="secondary" 
            className="mb-2"
            style={badgeColor ? { backgroundColor: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}44` } : {}}
          >
            {contactData.company}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {contactData.email && (
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors"
              style={hoverColor ? { '--hover-bg': `${hoverColor}22` } as React.CSSProperties : {}}
              onMouseEnter={(e) => hoverColor && (e.currentTarget.style.backgroundColor = `${hoverColor}22`)}
              onMouseLeave={(e) => hoverColor && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Mail className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm text-foreground">{contactData.email}</span>
            </div>
          )}
          
          {contactData.phone && (
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors"
              onMouseEnter={(e) => hoverColor && (e.currentTarget.style.backgroundColor = `${hoverColor}22`)}
              onMouseLeave={(e) => hoverColor && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Phone className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm text-foreground">{contactData.phone}</span>
            </div>
          )}
          
          {contactData.website && (
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors"
              onMouseEnter={(e) => hoverColor && (e.currentTarget.style.backgroundColor = `${hoverColor}22`)}
              onMouseLeave={(e) => hoverColor && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Globe className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm text-foreground">{contactData.website}</span>
            </div>
          )}
          
          {contactData.address && (
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-soft/50 transition-colors"
              onMouseEnter={(e) => hoverColor && (e.currentTarget.style.backgroundColor = `${hoverColor}22`)}
              onMouseLeave={(e) => hoverColor && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <MapPin className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm text-foreground">{contactData.address}</span>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {(contactData.linkedin || contactData.facebook || contactData.whatsapp || contactData.twitter) && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {contactData.linkedin && (
                <a
                  href={contactData.linkedin.startsWith('http') ? contactData.linkedin : `https://linkedin.com/in/${contactData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0077B5] text-white hover:opacity-90 transition-opacity text-sm"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {contactData.facebook && (
                <a
                  href={contactData.facebook.startsWith('http') ? contactData.facebook : `https://facebook.com/${contactData.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-opacity text-sm"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              )}
              {contactData.whatsapp && (
                <a
                  href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366] text-white hover:opacity-90 transition-opacity text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              {contactData.twitter && (
                <a
                  href={contactData.twitter.startsWith('http') ? contactData.twitter : `https://twitter.com/${contactData.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity text-sm"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {contactData.tags && contactData.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm font-semibold">Schlagworte</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contactData.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                  style={badgeColor ? { backgroundColor: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}44` } : {}}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {contactData.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="h-4 w-4 text-primary" style={iconColor ? { color: iconColor } : {}} />
              <span className="text-sm font-semibold">Bemerkungen</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contactData.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};