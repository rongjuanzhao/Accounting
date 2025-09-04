
import { CategoryProvider } from './contexts/CategoryContext';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

function App({ Component, pageProps }) {
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