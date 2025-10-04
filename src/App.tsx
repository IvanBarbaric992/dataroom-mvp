import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Toaster from '@/components/common/sonner';
import Home from '@/pages/Home';

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
