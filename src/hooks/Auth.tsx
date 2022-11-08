import React , { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api'

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: unknown;
    SignIn(credentials: SignInCredentials ): Promise<void>;
    SignOut(): void;
}

interface AuthState {
  token: string;
  user:  unknown;
}


 const AuthContext = createContext<AuthContextData>( {} as AuthContextData);

 const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
      const token =   localStorage.getItem('@GoBarber:token');
      const user =    localStorage.getItem('@GoBarber:user');

      if (token && user ){
          return { token, user: JSON.parse(user)}
      }

      return {} as AuthState;
    });

    const SignIn = useCallback( async({email, password}) => {
        const response = await api.post('sessions', {
         email,
         password   
        });

        const { token, user } = response.data;
        localStorage.setItem('@GoBarber:token', token);
        localStorage.setItem('@GoBarber:user', JSON.stringify(user));

        setData({token, user})
     }, []);

    const SignOut = useCallback(() => {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');

        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, SignIn, SignOut}}>
        {children}
        </AuthContext.Provider>
    );
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must bem used within a AuthProvider');
    }

    return context;
}


export {AuthProvider, useAuth};


