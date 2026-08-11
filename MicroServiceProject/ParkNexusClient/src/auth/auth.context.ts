import {useState} from 'react';
import constate from 'constate';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

function useValue() {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.UserInfo>();

  return {
    user,
    setUser,

    initializing,
    setInitializing,
  };
}

export const [AuthProvider, useAuth] = constate(useValue);
