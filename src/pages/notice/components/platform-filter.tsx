/** 플랫폼 필터 컴포넌트 */

import {memo, useCallback} from 'react';
import {Badge} from '@/components/ui/badge';
import type {PlatformFilter} from '@/types/notice';

interface PlatformFilterProps {
  selectedPlatform: PlatformFilter;
  onPlatformChange: (platform: PlatformFilter) => void;
}

const PLATFORM_OPTIONS: {value: PlatformFilter; label: string; color: string}[] = [
  {value: 'ALL', label: '전체', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200'},
  {value: 'MOBILE', label: 'Mobile', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'},
  {value: 'WEB', label: 'Web', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'},
];

export const PlatformFilterComponent = memo(
  ({selectedPlatform, onPlatformChange}: PlatformFilterProps) => {
    const handleOptionClick = useCallback(
      (value: PlatformFilter) => {
        onPlatformChange(value);
      },
      [onPlatformChange],
    );

    return (
      <div className="flex flex-wrap gap-2">
        {PLATFORM_OPTIONS.map((option) => (
          <Badge
            key={option.value}
            variant={selectedPlatform === option.value ? 'default' : 'outline'}
            className={`cursor-pointer ${selectedPlatform === option.value ? '' : option.color}`}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>
    );
  },
);
