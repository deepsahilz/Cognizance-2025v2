import React from 'react';
import { useUser } from '../contexts/UserContext';
import EmployerProfile from './EmployerProfile';
import FreelancerProfile from './FreelancerProfile';

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user.role === 'employer' ? (
        <EmployerProfile user={user} />
      ) : (
        <FreelancerProfile user={user} />
      )}
    </>
  );
};

export default Profile;
