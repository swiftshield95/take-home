import { useRef, useEffect } from 'react';
import { Button } from '@headlessui/react';
import AddMenu from './AddMenu';

export default function AddButton({
  createForm,
  isShow,
  setIsShow,
}: {
  createForm: CreateFormFn;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsShow(false); // Hide only if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef}>
      <Button
        className="h-[32px] py-1 px-[10px] border border-[#E1E1E1] rounded bg-white font-sans font-medium 
          text-sm leading-5 text-center [letter-spacing:-1.5%] text-[#1a1a1a] data-hover:border-[#2f72e2] data-hover:text-[#2f72e2]"
        onClick={() => {
          if (isShow) setIsShow(false);
          else setIsShow(true);
        }}
      >
        + Add page
      </Button>
      {isShow && <AddMenu createForm={createForm} />}
    </div>
  );
}
