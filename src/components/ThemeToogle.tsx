// components/ThemeToggle.tsx
import { GoMoon, GoSun } from 'react-icons/go';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="absolute bottom-0 right-2.5 transition-colors duration-100 stdInt"
      title="Zmień motyw"
    >
      {currentTheme === 'dark' ? (
        <GoSun className="h-9 md:h-14 w-auto text-blue-300" />
      ) : (
        <GoMoon className="h-9 md:h-14 w-auto text-blue-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
