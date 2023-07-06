import { Global } from '@mantine/core';

export function GlobalOverride() {
  return (
    <Global
      styles={(theme) => ({
        body: {
          scrollbarGutter: 'stable',
          '::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: theme.colors.gray[0],
          },

          '::-webkit-scrollbar-thumb': {
            background: '#1A2F48',
          },

          '::-webkit-scrollbar-track': {
            background: ' #C9C9C9',
            borderRadius: '10px',
          },
        },
      })}
    />
  );
}
