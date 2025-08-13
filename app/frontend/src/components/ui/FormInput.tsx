interface FormInputProps {
  Icon: React.ElementType;
  type: string;
  name?: string;
  placeholder: string;
  value: string;
  formType?: 'login' | 'register';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  error?: string;
}

const FormInput = ({
  Icon,
  type,
  placeholder,
  value,
  onChange,
  onClick,
  name,
  formType,
  error
}: FormInputProps) => (
  <div className="mb-6">
    <div className="relative flex items-center">
      <Icon className="absolute left-4 text-gray-400" size={20} />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
        autoComplete={
          formType === 'login' ? 'current-password' : 'new-password'
        }
        required
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-400 font-medium">{error}</p>}
  </div>
);

export default FormInput;
