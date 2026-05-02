import { useState, FC, FormEvent } from 'react';

import { loginRequest } from '../services/auth.service';

const Login: FC = () => {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    setError('');

    setSuccess('');

    try {

      const response = await loginRequest(email, password);

      if (response.success && response.token) {

        localStorage.setItem('token', response.token);

        setSuccess('Login successful!');

      }

    } catch (err: any) {

      setError(err.message);

    }

  };

  return (

    <div>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <div>

          <label>Email:</label>

          <input

            type="email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            required

          />

        </div>

        <div>

          <label>Password:</label>

          <input

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            required

          />

        </div>

        <button type="submit">Login</button>

      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {success && <p style={{ color: 'green' }}>{success}</p>}

    </div>

  );

};

export default Login;