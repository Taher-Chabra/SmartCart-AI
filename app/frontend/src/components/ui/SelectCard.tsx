import { CheckCircle2 } from 'lucide-react';

interface RoleCard {
   icon: React.ReactNode;
   title: string;
   description: string;
   isSelected: boolean;
   onClick: () => void;
}

const RoleOptionCard = ({ icon, title, description, isSelected, onClick }: RoleCard) => (
  <div
    onClick={onClick}
    className={`relative p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
      isSelected
        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg'
        : 'border-gray-700 bg-gray-800/50 hover:border-indigo-500/50'
    }`}
  >
    {isSelected && (
      <div className="absolute top-4 right-4 text-indigo-400">
        <CheckCircle2 size={24} />
      </div>
    )}
    <div className="flex flex-col items-center text-center">
      <div
        className={`mb-4 p-4 rounded-full bg-gray-700 transition-colors duration-300 ${isSelected ? 'bg-indigo-600' : 'bg-gray-700'}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

export default RoleOptionCard;