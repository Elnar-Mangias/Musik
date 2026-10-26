import React, { useState, useEffect } from 'react';

const API_URL = 'https://inai-col2.fishrungames.com/api';

export default function App() {
  const [view, setView] = useState<'home' | 'login' | 'register' | 'profile'>('home');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [profile, setProfile] = useState<any>(null);
  const [editName, setEditName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditName(data.name || '');
      } else {
        logout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (res.ok) {
        setSuccess('Регистрация успешна! Теперь вы можете войти.');
        setView('login');
      } else {
        const data = await res.json();
        setError(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const accessToken = data.token || data.access_token;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setView('profile');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });
      if (res.ok) {
        setSuccess('Профиль успешно обновлен!');
        fetchProfile();
      } else {
        setError('Ошибка обновления профиля');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProfile(null);
    setView('home');
  };

  return (
    <div className="container">
      <header>
        <div>
          <h1>⚡ SOUNDWAVE</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Официальный фан-клуб музыкальной группы</p>
        </div>
        <div className="nav-buttons">
          <button className="secondary" onClick={() => setView('home')}>Главная</button>
          {token ? (
            <>
              <button className="secondary" onClick={() => setView('profile')}>Профиль</button>
              <button className="secondary" onClick={logout} style={{ borderColor: '#ff4757', color: '#ff4757' }}>Выйти</button>
            </>
          ) : (
            <>
              <button className="secondary" onClick={() => setView('login')}>Войти</button>
              <button onClick={() => setView('register')}>Регистрация</button>
            </>
          )}
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {view === 'home' && (
        <div className="card">
          <h2>Добро пожаловать в мир живого звука!</h2>
          <p>Следите за нашими релизами, слушайте треки и управляйте своим аккаунтом участника сообщества.</p>
          
          <h3 style={{ marginTop: '30px' }}>Популярные треки группы</h3>
          <div className="track-list">
            <div className="track-item">
              <span>🎸 Midnight Echoes</span>
              <span style={{ color: 'var(--text-muted)' }}>3:45</span>
            </div>
            <div className="track-item">
              <span>🥁 Electric Storm</span>
              <span style={{ color: 'var(--text-muted)' }}>4:12</span>
            </div>
            <div className="track-item">
              <span>🎤 Broken Frequencies</span>
              <span style={{ color: 'var(--text-muted)' }}>3:30</span>
            </div>
          </div>
        </div>
      )}

      {view === 'register' && (
        <div className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <h2>Регистрация</h2>
          <form onSubmit={handleRegister}>
            <label>Имя / Никнейм</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            
            <label>Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            <button type="submit">Зарегистрироваться</button>
          </form>
        </div>
      )}

      {view === 'login' && (
        <div className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <h2>Вход в систему</h2>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            
            <label>Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            <button type="submit">Войти</button>
          </form>
        </div>
      )}

      {view === 'profile' && (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2>Личный кабинет</h2>
          {profile ? (
            <div>
              <p style={{ marginBottom: '20px' }}><strong>Email:</strong> {profile.email}</p>
              <form onSubmit={handleUpdate}>
                <label>Редактировать имя</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
                <button type="submit">Сохранить изменения</button>
              </form>
            </div>
          ) : (
            <p>Загрузка профиля...</p>
          )}
        </div>
      )}
    </div>
  );
}