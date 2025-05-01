
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sign Sync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
