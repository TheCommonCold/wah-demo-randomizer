import React, { ChangeEvent } from "react";

interface TextInputProps {
  label: string;
  value: string;
  setInputValue: (e: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  setInputValue,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/\D/g, ""));
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-bold text-white">{label}</label>
      <input
        className="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-black focus:outline-none"
        type="text"
        min={0}
        pattern={"D"}
        step={1}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextInput;
