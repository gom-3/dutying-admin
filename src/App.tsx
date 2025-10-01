import {memo} from 'react';
import {AuthProvider} from './contexts/auth-context';
import {Router} from './pages/router';

const App = memo(() => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
});

export default App;
