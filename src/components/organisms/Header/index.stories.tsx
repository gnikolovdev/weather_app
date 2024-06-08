import type { Meta, StoryObj } from '@storybook/react';

import Header from './index';

const meta = {
    title: "weather app/organisms/Header",
    component: Header,
    tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Base: Story = {
    args: {
        children: <></>
    },
};