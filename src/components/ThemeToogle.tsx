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
      className={`flex items-center justify-center gap-2 border-2 p-2.5 md:px-2 rounded-full hover:bg-gray-50 hover:dark:bg-gray-950 border-black dark:border-gray-700 dark:shadow-[0px_0px_10px_1px_rgb(0,0,0)] ${hoverActiveAnim} duration-300`}
      title="Zmień motyw"
    >
      {currentTheme === 'dark' ? (
        <GoSun className="h-8 w-auto text-blue-300 hover:text-blue-500 transition-colors duration-500" />
      ) : (
        <GoMoon className="h-8 w-auto text-blue-700 hover:text-blue-800 transition-colors duration-300" />
      )}
      <span className='hidden md:block'>
        {theme == 'dark' ? 'Jasny ' : 'Ciemny '}
        motyw
      </span>
    </button>
  );
};

export default ThemeToggle;
