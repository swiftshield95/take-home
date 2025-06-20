import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Button } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import {
  NewspaperIcon,
  BookOpenIcon,
  CheckCircleIcon,
  EyeIcon,
  BanknotesIcon,
  LockClosedIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface DraggableButtonProps {
  id: string;
  label: string;
  index: number;
  pageType: string;
  onDragStart: () => void;
  onDrop: () => void;
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFormIndex: number;
  setSelectedFormIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface DragData extends Record<string, unknown> {
  type: 'button';
  id: string;
  index: number;
}

// DraggableButton component
const DraggableButton: React.FC<DraggableButtonProps> = ({
  id,
  label,
  index,
  pageType,
  onDragStart,
  onDrop,
  setPosition,
  setIsShown,
  selectedFormIndex,
  setSelectedFormIndex,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);

  useEffect(() => {
    const el = buttonRef.current;
    invariant(el, 'Button ref is not assigned');

    return combine(
      draggable({
        element: el,
        getInitialData: () =>
          ({ type: 'button', id, index } as Record<string, unknown>),
        onDragStart: () => {
          setIsDragging(true);
          onDragStart();
        },
        onDrop: () => {
          setIsDragging(false);
          onDrop();
        },
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          return attachClosestEdge(
            { type: 'button', id, index }, // now properly typed
            {
              element,
              input,
              allowedEdges: ['left', 'right'],
            }
          );
        },
        canDrop: ({ source }) =>
          (source.data as unknown as DragData).type === 'button',
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: () => setIsOver(false),
      })
    );
  }, [id, index, onDragStart, onDrop]);

  return (
    <div
      ref={buttonRef}
      className={clsx(
        'flex items-center h-[32px] py-1 px-[10px] gap-2 border border-[#E1E1E1] rounded',
        isDragging && 'opacity-50',
        isOver && 'border-dashed border-blue-700',
        selectedFormIndex != index &&
          'bg-[#9da4b2]/15 text-[#677289] hover:bg-[#9da4b2]/35 hover:text-[#8c93a1]'
      )}
      onClick={() => setSelectedFormIndex(index)}
    >
      <Button as="button" className="cursor-move flex items-center gap-[6px]">
        {pageType == 'Form' && (
          <NewspaperIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-yellow-500' : ''
            }`}
          />
        )}
        {pageType == 'Cover' && (
          <BookOpenIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-yellow-500' : ''
            }`}
          />
        )}
        {pageType == 'Ending' && (
          <CheckCircleIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-blue-500' : ''
            }`}
          />
        )}
        {pageType == 'Review' && (
          <EyeIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-red-500' : ''
            }`}
          />
        )}
        {pageType == 'Payment' && (
          <BanknotesIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-purple-500' : ''
            }`}
          />
        )}
        {pageType == 'Login' && (
          <LockClosedIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-pink-500' : ''
            }`}
          />
        )}
        {pageType == 'Scheduling' && (
          <CalendarDaysIcon
            className={`h-5 w-5 ${
              selectedFormIndex == index ? 'text-green-500' : ''
            }`}
          />
        )}
        {label}
      </Button>
      {selectedFormIndex == index && (
        <Button
          className="cursor-pointer"
          onClick={() => {
            if (!buttonRef.current) return;
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top - 230 });
            setIsShown((prev) => !prev);
          }}
        >
          <EllipsisVerticalIcon className="h-4 w-4 text-[#9da4b2]" />
        </Button>
      )}
    </div>
  );
};

export default DraggableButton;
// NewspaperIcon,
//   BookOpenIcon,
//   CheckCircleIcon,
//   EyeIcon,
//   BanknotesIcon,
//   LockClosedIcon,
//   CalendarDaysIcon,
