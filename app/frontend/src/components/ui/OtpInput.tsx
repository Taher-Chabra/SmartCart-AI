import React from 'react';

interface InputOTPProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  length?: number;
}

const InputOTP: React.FC<InputOTPProps> = ({ value, onChange, length = 6 }) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const newValue = element.value.replace(/[^0-9]/g, '');
    if (newValue.length > 1) return;

    const newOtp = [...value.split('')];
    newOtp[index] = newValue;
    onChange(newOtp.join(''));

    // Focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Focus previous input on backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    onChange(pasteData);
  };

  return (
    <div
      className="flex items-center justify-center gap-2 md:gap-3"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 ease-in-out"
        />
      ))}
    </div>
  );
};

export default InputOTP;
