function DashboardHeader({ title, subtitle, icon }) {
  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex items-center mb-2 sm:mb-3">
        {icon}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2 sm:ml-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default DashboardHeader;
