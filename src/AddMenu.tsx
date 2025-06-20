import {
  NewspaperIcon,
  BookOpenIcon,
  CheckCircleIcon,
  EyeIcon,
  BanknotesIcon,
  LockClosedIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

type CreateFormFn = (pageType: string, index: number | undefined) => void;

export default function AddMenu({
  createForm,
  index,
}: {
  createForm: CreateFormFn;
  index: number | undefined;
}) {
  return (
    <div className="w-[300px] p-2 mt-3 relative shadow transparent">
      <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-t-8 border-transparent border-b-gray-200 absolute -top-4 left-5"></div>
      <div className="font-bold mb-2">Choose a page type</div>
      <div className="w-full h-px bg-gray-300"></div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Form', index)}
      >
        <div className="flex items-center mr-3">
          <NewspaperIcon className="h-7 w-7 p-1 border border-yellow-500 bg-yellow-100 text-yellow-700" />
        </div>
        <div>
          <div className="font-bold">Form</div>
          <div className="text-gray-500">Page to collect user input</div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Cover', index)}
      >
        <div className="flex items-center mr-3">
          <BookOpenIcon className="h-7 w-7 p-1 border border-blue-500 bg-blue-100 text-blue-700" />
        </div>
        <div>
          <div className="font-bold">Cover</div>
          <div className="text-gray-500">Welcome users to your form</div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Ending', index)}
      >
        <div className="flex items-center mr-3">
          <CheckCircleIcon className="h-7 w-7 p-1 border border-red-500 bg-red-100 text-red-700" />
        </div>
        <div>
          <div className="font-bold">Ending</div>
          <div className="text-gray-500">
            Show a thank you page or redirect users
          </div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Review', index)}
      >
        <div className="flex items-center mr-3">
          <EyeIcon className="h-7 w-7 p-1 border border-purple-500 bg-purple-100 text-purple-700" />
        </div>
        <div>
          <div className="font-bold">Review</div>
          <div className="text-gray-500">Let users review their submission</div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Payment', index)}
      >
        <div className="flex items-center mr-3">
          <BanknotesIcon className="h-7 w-7 p-1 border border-pink-500 bg-pink-100 text-pink-700" />
        </div>
        <div>
          <div className="font-bold">Payment</div>
          <div className="text-gray-500">Collect payments with Stripe</div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Login', index)}
      >
        <div className="flex items-center mr-3">
          <LockClosedIcon className="h-7 w-7 p-1 border border-green-500 bg-green-100 text-green-700" />
        </div>
        <div>
          <div className="font-bold">Login</div>
          <div className="text-gray-500">
            Let users login with email, password or SSO
          </div>
        </div>
      </div>
      <div
        className="flex hover:bg-gray-50 cursor-pointer"
        onClick={() => createForm('Scheduling', index)}
      >
        <div className="flex items-center mr-3">
          <CalendarDaysIcon className="h-7 w-7 p-1 border border-gray-500 bg-gray-100 text-gray-700" />
        </div>
        <div>
          <div className="font-bold">Scheduling</div>
          <div className="text-gray-500">Book meetings on your calendar</div>
        </div>
      </div>
    </div>
  );
}
