# React Integration with Django REST (Login/Signup)

### Step 1: Setup Axios (or Fetch API) for HTTP Requests

1. **Install Axios** (if not using Fetch API):
   ```bash
   npm install axios
    ```

2. **Create an Axios instance** in a `services/api.js` file (for centralized API requests):
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://127.0.0.1:8000/api/auth/',
   });

   export default api;
   ```

---

### Step 2: Create a Registration Form

1. Create a `Register.js` component for the registration form.
2. The form will collect `username`, `email`, and `password`.

#### Example Code:
```javascript
import React, { useState } from 'react';
import api from './services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register/', { username, email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + error.response.data);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
```

---

### Step 3: Create a Login Form

1. Create a `Login.js` component for the login form.
2. The form will collect `username` and `password`.

#### Example Code:
```javascript
import React, { useState } from 'react';
import api from './services/api';

const Login = ({ setTokens }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/', { username, password });
      const { access, refresh } = response.data;
      setTokens({ access, refresh });  // Store tokens in parent component or context
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Invalid credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
```

---

### Step 4: Store JWT Tokens

After successful login, the React app needs to store the `access` and `refresh` tokens securely. You can store them in `localStorage` or `sessionStorage`. To manage this, use a context or state in the parent component.

#### Example: Storing tokens in Context

1. Create a `TokenContext.js` for managing token state globally:
   
   ```javascript
   import React, { createContext, useState, useContext } from 'react';

   const TokenContext = createContext();

   export const useTokens = () => useContext(TokenContext);

   export const TokenProvider = ({ children }) => {
     const [tokens, setTokens] = useState({
       access: localStorage.getItem('accessToken'),
       refresh: localStorage.getItem('refreshToken'),
     });

     const setTokensAndStore = (tokens) => {
       localStorage.setItem('accessToken', tokens.access);
       localStorage.setItem('refreshToken', tokens.refresh);
       setTokens(tokens);
     };

     return (
       <TokenContext.Provider value={{ tokens, setTokens: setTokensAndStore }}>
         {children}
       </TokenContext.Provider>
     );
   };
   ```

2. **Wrap the app with the `TokenProvider`:**
   ```javascript
   import React from 'react';
   import { TokenProvider } from './TokenContext';
   import Register from './Register';
   import Login from './Login';

   const App = () => {
     return (
       <TokenProvider>
         <Register />
         <Login />
       </TokenProvider>
     );
   };

   export default App;
   ```

---

### Step 5: Protect Routes with Authentication

To access protected routes, you need to pass the `access` token in the `Authorization` header.

#### Example: Protected Route Component
```javascript
import React, { useEffect, useState } from 'react';
import api from './services/api';
import { useTokens } from './TokenContext';

const Protected = () => {
  const { tokens } = useTokens();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await api.get('/protected/', {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Access denied. Please login.');
      }
    };

    if (tokens.access) {
      fetchProtectedData();
    } else {
      setMessage('Access denied. Please login.');
    }
  }, [tokens]);

  return <div>{message}</div>;
};

export default Protected;
```

---

### Step 6: Implement Token Refresh Flow (Optional)

If the access token expires, you can use the `refresh` token to get a new one.

1. **Create a function to refresh the token**:
   ```javascript
   const refreshAccessToken = async (refreshToken) => {
     try {
       const response = await api.post('/token/refresh/', { refresh: refreshToken });
       return response.data.access;
     } catch (error) {
       console.error("Token refresh failed:", error);
       return null;
     }
   };
   ```

2. **Call `refreshAccessToken` when access token expires** and update the `access` token in state.

---

### Step 7: Handle Logout

When logging out, clear the tokens from storage and state:

```javascript
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setTokens({ access: null, refresh: null });
};
```

---

### Step 8: Finalize and Test

1. Test the registration and login forms to ensure they interact correctly with the backend.
2. Protect routes that require authentication.
3. Ensure the token refresh logic works if the access token expires.
