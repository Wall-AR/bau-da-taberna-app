import { Crown } from 'lucide-react';

interface TavernLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const TavernLogo = ({ size = 'md', showText = true }: TavernLogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-tavern-gold rounded-lg blur-sm opacity-50" />
        <div className="relative bg-tavern-gold text-tavern-wood-dark p-2 rounded-lg">
          <Crown className={`${sizeClasses[size]} fill-current`} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-medieval font-black ${textSizeClasses[size]} text-foreground leading-none`}>
            Baú da Taberna
          </h1>
          <span className="text-xs font-content text-muted-foreground uppercase tracking-wide">
            Sistema Medieval
          </span>
        </div>
      )}
    </div>
  );
};