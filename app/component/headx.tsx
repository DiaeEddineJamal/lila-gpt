import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface LogoTitleProps {
  logoSrc: string | StaticImageData;  // Allow both string paths and imported images
  logoAlt: string;
  title: string;
  logoSize?: number;
  className?: string;
}

const LogoTitle: React.FC<LogoTitleProps> = ({
  logoSrc,
  logoAlt,
  title,
  logoSize = 250,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src={logoSrc}  // Can now accept both static imports and URL strings
        alt={logoAlt}
        width={logoSize}
        height={logoSize}
        className="rounded-full"
      />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        {title}
      </h1>
    </div>
  );
};

export default LogoTitle;
