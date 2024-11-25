import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import { MAIN_DASHBOARD_LOGIN, MAIN_DASHBOARD_URL } from './app/constants';
import { ApolloProvider } from '@apollo/client';
import { client } from './app/ApolloClient';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Suspense, lazy } from 'react';

{
  /* Redux Setup */
}
import { Provider } from 'react-redux';
import store from './redux/Store';

{
  /* Public Pages */
}
const Home = lazy(() => import('./pages/Home'));

// import RegisterPage from "./pages/Register";

{
  /* Auth Protected Routes */
}
import ProtectedRoutes from './ProtectedRoutes';
import { MoonLoader } from 'react-spinners';
import Announces from './pages/dashboard/announce/announces';
import CreateAnnounce from './pages/dashboard/announce/create';
import Blogs from '@/pages/dashboard/blogs/blogs';
import CreateBlog from '@/pages/dashboard/blogs/create';
import Showrooms from './pages/dashboard/showroom/showroom';
import CreateShowroom from './pages/dashboard/showroom/create';

const LoginPage = lazy(() => import('./pages/auth/admin/loginPage'));
const Dashboard = lazy(() => import('./pages/dashboard/dashboard'));
const Products = lazy(() => import('./pages/dashboard/products/products'));
const CreateProduct = lazy(() => import('./pages/dashboard/products/create'));

// TODO: Add a loading spinner
const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
            <MoonLoader size={25} />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path={MAIN_DASHBOARD_LOGIN} element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path={`admin/`} element={<Dashboard />} />
            <Route path={`${MAIN_DASHBOARD_URL}/`} element={<Dashboard />} />
            <Route
              path={`${MAIN_DASHBOARD_URL}/products`}
              element={<Products />}
            />
            <Route
              path={`${MAIN_DASHBOARD_URL}/products/create`}
              element={<CreateProduct />}
            />

            <Route
              path={`${MAIN_DASHBOARD_URL}/announce`}
              element={<Announces />}
            />

            <Route
              path={`${MAIN_DASHBOARD_URL}/announce/create`}
              element={<CreateAnnounce />}
            />

            <Route path={`${MAIN_DASHBOARD_URL}/blogs`} element={<Blogs />} />
            <Route
              path={`${MAIN_DASHBOARD_URL}/blog/create`}
              element={<CreateBlog />}
            />

            <Route
              path={`${MAIN_DASHBOARD_URL}/showroom`}
              element={<Showrooms />}
            />
            <Route
              path={`${MAIN_DASHBOARD_URL}/showroom/create`}
              element={<CreateShowroom />}
            />

            <Route
              path="*"
              element={
                <div className="flex justify-center items-center h-screen">
                  <div className="text-3xl font-bold text-gray-800">
                    404 Not Found
                  </div>
                </div>
              }
            />
          </Route>

          {/* Redirect/Path for handling unmatched routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApolloProvider>
  </Provider>,
);
