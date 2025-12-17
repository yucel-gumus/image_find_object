
export function DetectTypeSelector() {
  return (
    <div className="flex flex-col flex-shrink-0">
      <div className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Tespit Türü:
      </div>
      <div className="flex flex-col gap-3">
        <div className="py-4 px-6 flex items-center bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 text-blue-700 dark:text-blue-300 rounded-lg">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl">🎭</span>
            <span className="font-medium">Segmentasyon maskeleri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
