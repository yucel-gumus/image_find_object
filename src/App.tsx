import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Content } from './components/Content';
import { ExampleImages } from './components/ExampleImages';
import { ExtraModeControls } from './components/ExtraModeControls';
import { Prompt } from './components/Prompt';
import { SideControls } from './components/SideControls';
import { TopBar } from './components/TopBar';
import {
  InitFinishedAtom,
} from './store/atoms';


function App() {
  const [initFinished] = useAtom(InitFinishedAtom);

  useEffect(() => {
    if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-900">
      <div className="flex grow flex-col border-b overflow-hidden">
        <TopBar />
        {initFinished ? <Content /> : null}
        <ExtraModeControls />
      </div>
      <div className="flex shrink-0 w-full overflow-auto py-6 px-5 gap-6 lg:items-start bg-white dark:bg-gray-800 border-t">
        <div className="flex flex-col lg:flex-col gap-6 items-center border-r border-gray-200 dark:border-gray-700 pr-6">
          <ExampleImages />
          <SideControls />
        </div>
        <div className="flex flex-row gap-6 grow">
          <Prompt />
        </div>
      </div>
    </div>
  );
}

export default App;
