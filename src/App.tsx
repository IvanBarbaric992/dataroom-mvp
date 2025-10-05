import { BrowserRouter, Route, Routes } from 'react-router-dom';

import RootLayout from '@/components/layouts/RootLayout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<RootLayout />} path="/">
        <Route index element={<Home />} />
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
