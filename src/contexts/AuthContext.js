import React, {createContext, useCallback, useEffect, useState} from 'react';
import {getStorage, removeStorage} from '../utils/storageUtils';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {paths} from '../routes/paths';
import {setUserDetails} from '../redux/auth/authSlice';

export const AuthContext = createContext({
  logout: () => Promise.resolve(),
  setIsAuthenticated: () => Promise.resolve(),
});
export default function AuthProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //Global State
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  //functions
  const checkToken = useCallback(async () => {
    const accessToken = await getStorage('token');
    if (!accessToken && !isAuthenticated) {
      navigate(paths.signIn);
    } else {
      navigate(paths.home);
    }
  }, [navigate, isAuthenticated]);

  const logout = useCallback(async () => {
    await removeStorage('token');
    dispatch(setUserDetails({}));
    setIsAuthenticated(false);
  });

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <AuthContext.Provider value={{logout, setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
}
