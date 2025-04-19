import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
