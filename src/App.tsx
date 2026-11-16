import { useAtom } from 'jotai';
import { Content } from './components/Content';
import { ExampleImages } from './components/ExampleImages';
import { ExtraModeControls } from './components/ExtraModeControls';
import { Prompt } from './components/Prompt';
import { SideControls } from './components/SideControls';
import { TopBar } from './components/TopBar';
import { DetectTypeSelector } from './components/DetectTypeSelector';
import { Toast } from './components/Toast';
import { InitFinishedAtom } from './store/atoms';

function App() {
  const [initFinished] = useAtom(InitFinishedAtom);

  return (
    <div className="flex flex-col min-h-screen bg-[#EDF3EE] text-[#253341] font-sans selection:bg-[#F2A488] selection:text-[#253341]">
      {/* Toast Notification Container */}
      <Toast />

      {/* Top Header */}
      <TopBar />

      {/* Main Workspace Layout */}
      <main className="grow w-full max-w-[1600px] mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Visual Canvas Viewport (7 Cols on Desktop) */}
          <section className="lg:col-span-7 flex flex-col gap-4 w-full">
            <div className="theme-card rounded-3xl p-4 sm:p-5 flex flex-col gap-4 min-h-[500px]">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EC7D55] border border-[#AB421C]"></span>
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#253341]">
                    Görsel Analiz Alanı
                  </h2>
                </div>
              </div>

              {/* Central Canvas Viewport */}
              {initFinished ? <Content /> : null}

              {/* Extra Mode Floating Bar */}
              <ExtraModeControls />
            </div>
          </section>

          {/* Right Control Center (5 Cols on Desktop) */}
          <aside className="lg:col-span-5 flex flex-col gap-5 w-full">
            {/* AI Prompt & Parameters Card */}
            <div className="theme-card rounded-3xl p-5 sm:p-6 flex flex-col gap-5">
              <Prompt />
            </div>

            {/* Source & Preset Tools Card */}
            <div className="theme-card rounded-3xl p-5 sm:p-6 flex flex-col gap-5">
              <SideControls />
              <DetectTypeSelector />
              <div className="pt-2 border-t border-[#BCC7D2]">
                <ExampleImages />
              </div>
            </div>
          </aside>

        </div>
      </main>
      <footer className="w-full py-3 text-center text-xs text-[#3E5164] border-t border-[#BCC7D2] mt-4">
        <p>Geliştirici: <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-[#253341] hover:text-[#AB421C] transition-colors">Yücel Gümüş</a></p>
      </footer>
    </div>
  );
}

export default App;
