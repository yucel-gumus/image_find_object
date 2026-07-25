export function DetectTypeSelector() {
  return (
    <div className="flex flex-col flex-shrink-0 w-full">
      <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D231C] mb-2">
        Tespit Modu
      </span>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FFEBD3] border-2 border-[#9BCEC1] text-[#15382F] font-bold text-xs shadow-xs">
        <svg className="w-5 h-5 text-[#15382F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <span>Segmentasyon Maskeleri & Sınırlayıcı Kutular</span>
      </div>
    </div>
  );
}
