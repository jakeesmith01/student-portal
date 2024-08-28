import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function fetchUser() {
      // The whoami route returns the logged-in user
      const response = await fetch(`/api/whoami`);

      // If we get an error status code we are not logged in, 
      // so initiate the CAS login process
      if(!response.ok) return window.location = '/api/login';

      // Otherwise, we have our user data
      const userData = await response.json();
      setUser(userData);
    }
    fetchUser();

  },[user]);
  
  // TODO: Refactor this into a login button
  if(!user) return (<h1>Not logged in</h1>);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );

}