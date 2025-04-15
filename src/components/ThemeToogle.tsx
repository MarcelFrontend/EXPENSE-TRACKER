// components/ThemeToggle.tsx
import { GoMoon, GoSun } from 'react-icons/go';
import { useTheme } from 'next-themes';
import { hoverActiveAnim } from '@/utils/utils';

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`absolute bottom-0 right-2.5 transition-colors duration-200 ${hoverActiveAnim}`}
      title="Zmień motyw"
    >
      {currentTheme === 'dark' ? (
        <GoSun className="h-9 md:h-14 w-auto text-blue-300 hover:text-blue-500 transition-colors duration-500" />
      ) : (
        <GoMoon className="h-9 md:h-14 w-auto text-blue-700 hover:text-blue-800 transition-colors duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
