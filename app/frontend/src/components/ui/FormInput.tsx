interface FormInputProps {
  Icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ Icon, type, placeholder, value, onChange }: FormInputProps) => (
  <div className="relative flex items-center mb-4">
    <Icon className="absolute left-4 text-gray-400" size={20} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
      required
    />
  </div>
);

export default FormInput;
