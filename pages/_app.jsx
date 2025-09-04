import { CategoryProvider } from '../src/contexts/CategoryContext';

// 全局样式
import '../src/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <CategoryProvider>
      <Component {...pageProps} />
    </CategoryProvider>
  );
}

export default MyApp;