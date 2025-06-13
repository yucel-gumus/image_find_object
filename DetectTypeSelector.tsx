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
import {DetectTypeAtom, HoverEnteredAtom} from './atoms';
import {DetectTypes} from './Types';

export function DetectTypeSelector() {
  return (
    <div className="flex flex-col flex-shrink-0">
      <div className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Tespit Türü:
      </div>
      <div className="flex flex-col gap-3">
        {[
          '2D sınırlayıcı kutular',
          'Segmentasyon maskeleri',
          'Noktalar',
          '3D sınırlayıcı kutular',
        ].map((label) => (
          <SelectOption key={label} label={label} />
        ))}
      </div>
    </div>
  );
}

function SelectOption({label}: {label: string}) {
  const [detectType, setDetectType] = useAtom(DetectTypeAtom);
  const [, setHoverEntered] = useAtom(HoverEnteredAtom);

  const getIcon = (type: string) => {
    switch (type) {
      case '2D sınırlayıcı kutular':
        return '📦';
      case 'Segmentasyon maskeleri':
        return '🎭';
      case 'Noktalar':
        return '📍';
      case '3D sınırlayıcı kutular':
        return '🧊';
      default:
        return '🔍';
    }
  };

  return (
    <button
      className={`py-4 px-6 items-center bg-transparent text-center gap-3 rounded-lg transition-all duration-200 hover:shadow-md ${
        detectType === label
          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 text-blue-700 dark:text-blue-300'
          : 'border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
      }`}
      onClick={() => {
        setHoverEntered(false);
        setDetectType(label as DetectTypes);
      }}>
      <div className="flex items-center justify-center gap-3">
        <span className="text-xl">{getIcon(label)}</span>
        <span className="font-medium">{label}</span>
      </div>
    </button>
  );
}
