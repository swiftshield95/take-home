import { useState, useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { FlagIcon } from '@heroicons/react/24/solid';
import {
  PencilIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import FormButton from './FormButton';
import AddButton from './AddButton';
import AddMenu from './AddMenu';

interface FormPage {
  pageType: string;
  label: string;
  id: string;
}

interface DragData {
  type: 'button';
  id: string;
  index: number;
}

interface DropTargetData extends DragData {
  closestEdge: Edge | null;
}

const App = () => {
  const [forms, setForms] = useState<FormPage[]>([
    {
      pageType: 'Cover',
      label: 'Cover',
      id: 'page-0',
    },
    {
      pageType: 'Scheduling',
      label: 'Scheduling',
      id: 'page-1',
    },
  ]);

  const [isShown, setIsShown] = useState(false);
  const [isAddMenuShow, setIsAddMenuShow] = useState(false);
  const [plusMenuIndex, setPlusMenuIndex] = useState<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [plusMenuPosition, setPlusMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data as unknown as DragData;
        const targetData = target.data as unknown as DropTargetData;

        if (
          !sourceData ||
          !targetData ||
          sourceData.type !== 'button' ||
          targetData.type !== 'button'
        ) {
          return;
        }

        const sourceIndex = sourceData.index;
        const targetIndex = targetData.index;
        const closestEdge = extractClosestEdge(
          targetData as unknown as Record<string, unknown>
        );

        if (sourceIndex === targetIndex) return;

        setForms((prev) => {
          const newForms = [...prev];
          const [movedForm] = newForms.splice(sourceIndex, 1);
          let adjustedIndex: number;
          if (sourceIndex < targetIndex)
            adjustedIndex =
              closestEdge === 'right' ? targetIndex : targetIndex - 1;
          else
            adjustedIndex =
              closestEdge === 'right' ? targetIndex + 1 : targetIndex;
          newForms.splice(adjustedIndex, 0, movedForm);
          return newForms;
        });
      },
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node) &&
        isShown &&
        (event.target as HTMLElement)?.localName !== 'svg'
      ) {
        setIsShown(false); // Hide only if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenuRef, isShown]);

  const handleDragStart = () => {
    // console.log('Drag started');
  };

  const handleDrop = () => {
    // console.log('Drag ended');
  };

  const createForm = (pageType: string, index: number | undefined): void => {
    if (index == undefined)
      setForms((prev: FormPage[]) => {
        return [
          ...prev,
          { pageType, label: pageType, id: `page-${prev.length}` },
        ];
      });
    else {
      setForms((prev) => {
        const updated = [...prev];
        updated.splice(index + 1, 0, {
          pageType,
          label: pageType,
          id: `page-${forms.length}`,
        }); // insert at second position
        return updated;
      });
    }
  };

  const setFirstPage = () => {
    setForms((prev) => {
      if (selectedFormIndex === 0) return prev; // Already first, no action needed

      const newForms = [...prev];
      const [item] = newForms.splice(selectedFormIndex, 1); // remove the i-th element
      newForms.unshift(item); // insert at the beginning
      return newForms;
    });
    setSelectedFormIndex(0);
    setIsShown(false);
  };

  const deletePage = () => {
    setForms((prev) => {
      const newForms = [...prev];
      newForms.splice(selectedFormIndex, 1); // remove the i-th element
      return newForms;
    });
    setSelectedFormIndex((prev) => (prev == 0 ? 0 : prev - 1));
    setIsShown(false);
  };

  const duplicatePage = () => {
    setForms((prev) => {
      const itemToDuplicate = prev[selectedFormIndex];
      const newItem = {
        ...itemToDuplicate,
        id: `page-${prev.length}`, // or use uuid if needed
        label: itemToDuplicate.label + ' (copy)',
      };
      const newForms = [...prev];
      newForms.splice(selectedFormIndex + 1, 0, newItem); // insert after the original
      return newForms;
    });
    setIsShown(false);
  };

  return (
    <div className="relative h-screen">
      <div className="flex p-4 rounded overflow-x-auto top-[300px] absolute">
        {forms.map((form, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div key={form.id} className="flex">
              <FormButton
                id={form.id}
                label={form.label}
                pageType={form.pageType}
                index={index}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                setPosition={setPosition}
                setIsShown={setIsShown}
                selectedFormIndex={selectedFormIndex}
                setSelectedFormIndex={setSelectedFormIndex}
              />
              <svg
                className={`h-[32px] ${
                  isHovered ? 'w-[56px]' : 'w-[20px]'
                } transition-all duration-300 ease-in-out`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={(e) => {
                  setHoveredIndex(null);
                  const wrapper = wrapperRef.current;
                  if (!wrapper) return;
                  const rect = wrapper.getBoundingClientRect();
                  const isInside =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top - 5 &&
                    e.clientY <= rect.bottom;
                  if (!isInside) {
                    console.log(e.clientX, e.clientY, rect);
                    setPlusMenuIndex(null);
                  }
                }}
              >
                <line
                  stroke="gray"
                  strokeDasharray="3,3"
                  strokeWidth={1}
                  x1={0}
                  x2={isHovered ? 56 : 20}
                  y1={16}
                  y2={16}
                />
                {isHovered && (
                  <foreignObject x={20} y={8} width={16} height={16}>
                    <div
                      className="w-[16px] h-[16px] bg-white text-black flex justify-center items-center rounded-full border border-[#e1e1e1] font-sans text-[12px] leading-none cursor-pointer"
                      style={{ fontFamily: 'auto' }}
                      onClick={(e) => {
                        setPlusMenuIndex(index);
                        const rect = (
                          e.target as HTMLElement
                        ).getBoundingClientRect();
                        setPlusMenuPosition({
                          x: rect.left - 20,
                          y: rect.bottom + 5,
                        });
                      }}
                    >
                      +
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>
          );
        })}
        <AddButton
          createForm={createForm}
          isShow={isAddMenuShow}
          setIsShow={setIsAddMenuShow}
        />
        {isShown && (
          <div
            style={{ position: 'fixed', top: position.y, left: position.x }}
            ref={contextMenuRef}
          >
            <div className="w-[240px] bg-white border rounded-[12px] border-[#e1e1e1] shadow-[0px_1px_3px_0px_#0000000A,_0px_1px_1px_0px_#00000005] flex flex-col ">
              <div
                className="w-full h-[40px] p-3 gap-1 bg-[#fafbfc] font-medium text-[16px] leading-[24px] tracking-[-0.015em] align-middle text-[#1a1a1a] rounded-tl-[12px] rounded-tr-[12px]"
                style={{
                  // fontFamily: 'BL Melody',
                  borderBottom: '0.5px #e1e1e1',
                }}
              >
                Settings
              </div>
              <div className=" flex flex-col px-3 pt-3 pb-[14px] gap-[14px]">
                <div
                  className="flex items-center gap-[6px] hover:bg-gray-50 cursor-pointer"
                  onClick={setFirstPage}
                >
                  <FlagIcon className="h-4 w-4 text-[#2f72e2]" />
                  <span className="font-medium text-[14px] leading-[16px] tracking-[-0.015em] align-middle font-inter">
                    Set as first page
                  </span>
                </div>
                <div className="flex items-center gap-[6px] hover:bg-gray-50 cursor-pointer">
                  <PencilIcon className="h-4 w-4 text-[#9da4b2]" />
                  <span className="font-medium text-[14px] leading-[16px] tracking-[-0.015em] align-middle font-inter">
                    Rename
                  </span>
                </div>
                <div className="flex items-center gap-[6px] hover:bg-gray-50 cursor-pointer">
                  <ClipboardIcon className="h-4 w-4 text-[#9da4b2]" />
                  <span className="font-medium text-[14px] leading-[16px] tracking-[-0.015em] align-middle font-inter">
                    Copy
                  </span>
                </div>
                <div
                  className="flex items-center gap-[6px] hover:bg-gray-50 cursor-pointer"
                  onClick={duplicatePage}
                >
                  <DocumentDuplicateIcon className="h-4 w-4 text-[#9da4b2]" />
                  <span className="font-medium text-[14px] leading-[16px] tracking-[-0.015em] align-middle font-inter">
                    Duplicate
                  </span>
                </div>
                <div className="h-[0.5px] bg-[#e1e1e1]" />
                <div
                  className="flex items-center gap-[6px] hover:bg-gray-50 cursor-pointer"
                  onClick={deletePage}
                >
                  <TrashIcon className="h-4 w-4 text-[#ef494f]" />
                  <span className="font-medium text-[14px] leading-[16px] tracking-[-0.015em] align-middle font-inter text-[#ef494f]">
                    Delete
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {plusMenuIndex != null && (
        <div
          className="absolute"
          style={{ top: plusMenuPosition.y, left: plusMenuPosition.x }}
          onMouseEnter={() => setHoveredIndex(plusMenuIndex)}
          onMouseLeave={() => {
            setHoveredIndex(null);
            setPlusMenuIndex(null);
          }}
          ref={wrapperRef}
        >
          <AddMenu createForm={createForm} index={plusMenuIndex} />
        </div>
      )}
    </div>
  );
};

export default App;
