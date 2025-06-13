/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {useAtom} from 'jotai';
import {DetectTypeAtom, HoverEnteredAtom, RevealOnHoverModeAtom} from './atoms';
import {useResetState} from './hooks';

export function TopBar() {
  const resetState = useResetState();
  const [revealOnHover, setRevealOnHoverMode] = useAtom(RevealOnHoverModeAtom);
  const [detectType] = useAtom(DetectTypeAtom);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);

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
        {detectType === '2D sınırlayıcı kutular' ||
        detectType === 'Segmentasyon maskeleri' ? (
          <div>
            <label className="flex items-center gap-2 px-3 select-none whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={revealOnHover}
                className="rounded"
                onChange={(e) => {
                  if (e.target.checked) {
                    setHoverEntered(false);
                  }
                  setRevealOnHoverMode(e.target.checked);
                }}
              />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Üzerine gelince göster
              </div>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
