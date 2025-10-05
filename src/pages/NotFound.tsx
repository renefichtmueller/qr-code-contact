import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft via-background to-secondary">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('notFound.title')}</h1>
        <p className="text-xl text-muted-foreground mb-4">{t('notFound.message')}</p>
        <a href="/" className="text-primary hover:text-primary-glow underline">
          {t('notFound.backHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
