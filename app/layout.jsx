import { CategoryProvider } from '../src/contexts/CategoryContext';

// 全局样式
import '../src/index.css';

export const metadata = {
  title: 'Accounting App',
  description: 'Personal accounting and bill management application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <CategoryProvider>
          {children}
        </CategoryProvider>
      </body>
    </html>
  );
}
