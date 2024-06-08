import type { Meta, StoryObj } from '@storybook/react';

import LoadingAnimation from './index';

const meta = {
    title: "weather app/atoms/loadinganimation",
    component: LoadingAnimation,
    tags: ['autodocs'],
} satisfies Meta<typeof LoadingAnimation>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Base: Story = {
    args: {
    },
  };