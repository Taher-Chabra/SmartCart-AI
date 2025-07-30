interface ToggleSwitchProps {
  value: boolean;
  setValue: (value: boolean) => void;
  htmlFor?: string;
  id?: string;
}

const ToggleSwitch = ({ value, setValue, htmlFor, id }: ToggleSwitchProps) => (
  <div className="flex items-center justify-between mb-6">
    <label htmlFor={htmlFor} className="text-gray-300">
      Are you a seller?
    </label>
    <button
      type="button"
      id={id}
      onClick={() => setValue(!value)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${value ? 'bg-indigo-600' : 'bg-gray-700'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

export default ToggleSwitch;
