// components/ThemeToggle.tsx
import { GoMoon, GoSun } from 'react-icons/go';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"


  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`absolute bottom-0 right-2.5 transition-colors duration-200 ${hoverActiveAnim}`}
      title="Zmień motyw"
    >
      {currentTheme === 'dark' ? (
        <GoSun className="h-12 md:h-14 w-auto text-blue-300 hover:text-blue-500 transition-colors duration-500" />
      ) : (
        <GoMoon className="h-12 md:h-14 w-auto text-blue-700 hover:text-blue-800 transition-colors duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
