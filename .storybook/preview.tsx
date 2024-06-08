import React from 'react';
import type { Preview } from "@storybook/react";
import { withRouter } from 'storybook-addon-react-router-v6';
import { withReactContext } from 'storybook-react-context';
import { GlobalContextProvider } from '../src/contexts/GlobalContextProvider';

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    withRouter,
    (Story) => (
      <GlobalContextProvider unit='imperial' position={{lat: 42.698334, lon: 23.319941}}>
          <Story />
      </GlobalContextProvider>
  ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  }
};

export default preview;
