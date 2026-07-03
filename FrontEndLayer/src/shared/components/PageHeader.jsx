const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-row justify-between items-end w-full">
      <div className="flex flex-col items-start gap-1">
        <h1 className="font-heading font-semibold text-[32px] leading-[38px] text-primary m-0">
          {title}
        </h1>
        {subtitle && (
          <p className="font-heading font-normal text-base leading-6 text-text-secondary m-0">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-row items-start gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
