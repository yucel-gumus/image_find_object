import { useResetState } from '../hooks';

export function TopBar() {
  const resetState = useResetState();

  return (
    <div className="flex w-full items-center px-4 py-3 border-b justify-between bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex gap-3 items-center">
        <button
          onClick={() => {
            resetState();
          }}
          className="!p-2 !border-none underline bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          style={{
            minHeight: '0',
          }}>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <span>🔄</span>
            <span>Oturumu Sıfırla</span>
          </div>
        </button>
      </div>
      <div className="flex gap-3 items-center">
      </div>
    </div>
  );
}
