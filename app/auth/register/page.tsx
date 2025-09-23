'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  leetcode_username: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    leetcode_username: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.username.trim()) {
      return 'Username is required';
    }
    if (!formData.password) {
      return 'Password is required';
    }
    if (!formData.confirmPassword) {
      return 'Please confirm your password';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (formData.username.includes(' ')) {
      return 'Username cannot contain spaces';
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          leetcode_username: formData.leetcode_username || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div>
        <h1>Registration Successful!</h1>
        <p>Your account has been created successfully. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Register for LeetTrack</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="leetcode_username">LeetCode Username (optional):</label>
          <input
            type="text"
            id="leetcode_username"
            name="leetcode_username"
            value={formData.leetcode_username}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div>
            <p>Error: {error}</p>
          </div>
        )}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
      </form>

      <div>
        <p>Already have an account? <a href="/auth/login">Login here</a></p>
      </div>
    </div>
  );
}
