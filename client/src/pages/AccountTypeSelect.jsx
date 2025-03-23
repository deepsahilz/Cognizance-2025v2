import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccountTypeSelect() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleSelect = (type) => {
    setSelected(type);
  };

  const handleSubmit = () => {
    if (selected) {
      navigate('/login', { state: { accountType: selected } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-semibold mb-10">Join as a client or freelancer</h1>

      <div className="flex gap-6 mb-8">
        <div
          onClick={() => handleSelect('client')}
          className={`border rounded-xl p-6 w-60 cursor-pointer text-center transition-all duration-300 ${
            selected === 'client'
              ? 'border-purple-500 bg-purple-100'
              : 'border-gray-300 bg-white'
          } hover:scale-105`}
        >
          <div className="text-4xl mb-4">👨‍💼</div>
          <p className="font-medium">I'm a client, hiring for a project</p>
        </div>

        <div
          onClick={() => handleSelect('freelancer')}
          className={`border rounded-xl p-6 w-60 cursor-pointer text-center transition-all duration-300 ${
            selected === 'freelancer'
              ? 'border-purple-500 bg-purple-100'
              : 'border-gray-300 bg-white'
          } hover:scale-105`}
        >
          <div className="text-4xl mb-4">💻</div>
          <p className="font-medium">I'm a freelancer, looking for work</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className={`px-8 py-3 rounded-full text-white font-semibold transition ${
          selected
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Create Account
      </button>

      <p className="mt-6 text-sm">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-green-600 underline cursor-pointer"
        >
          Log In
        </span>
      </p>
    </div>
  );
}

export default AccountTypeSelect;
