import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { getMe } from './store/auth/authThunks';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
