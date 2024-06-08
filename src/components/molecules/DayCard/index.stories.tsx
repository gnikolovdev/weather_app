import type { Meta, StoryObj } from '@storybook/react';

import DayCard from './index';
import { dayData } from './stories-sample-data';

const meta = {
    title: "weather app/molecules/DayCard",
    component: DayCard,
    tags: ['autodocs']
} satisfies Meta<typeof DayCard>;

export default meta;

type Story = StoryObj<typeof meta>;
export const TodayOrTomorrow: Story = {
args: {
    day: dayData,
    index: 0
    },
};

export const WeekDayName: Story = {
    args: {
        day: dayData,
        index: 2
    },
};