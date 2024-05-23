import { useTheme } from 'next-themes';
import { Button } from '@/dashboard/ui/button';
import { IconMoon } from '@/dashboard/icons/moon';
import { IconSun } from '@/dashboard/icons/sun';
import React from 'react';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
    className="ml-4"
    variant={"ghost"}

      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      {resolvedTheme === 'light' ? <IconMoon  /> : <IconSun  />}
    </Button>
  );
};

export default React.memo(ThemeToggle);
