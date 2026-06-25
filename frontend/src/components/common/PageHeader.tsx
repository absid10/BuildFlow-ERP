import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, extra }) => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {extra && <div className="page-header-right">{extra}</div>}
    </div>
  );
};

export default PageHeader;
