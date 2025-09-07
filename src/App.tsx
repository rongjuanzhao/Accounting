
import { CategoryProvider } from './contexts/CategoryContext';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <CategoryProvider>
      <div className={styles.appContainer}>
        <Sidebar />
        <Component {...pageProps} />
      </div>
    </CategoryProvider>
  );
}

export default App;