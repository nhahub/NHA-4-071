const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 gap-4 text-center">
      {icon && <div className="opacity-40">{icon}</div>}
      {title && (
        <h3 className="font-heading font-semibold text-xl text-text-secondary m-0">
          {title}
        </h3>
      )}
      {description && (
        <p className="font-heading font-normal text-base text-text-muted m-0 max-w-[400px]">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
