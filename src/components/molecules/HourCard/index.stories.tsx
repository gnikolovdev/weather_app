import type { Meta, StoryObj } from "@storybook/react";

import DayCard from "./index";
import { hourData } from "../DayCard/stories-sample-data";
import HourCard from "./index";

const meta = {
    title: "weather app/molecules/HourCard",
    component: HourCard,
    tags: ["autodocs"]
} satisfies Meta<typeof DayCard>;

export default meta;

type Story = StoryObj<typeof meta>;
export const HourMetric: Story = {
    args: {
        hour: hourData,
        unit: "metric"
    },
};

export const HourImperial: Story = {
    args: {
        hour: hourData,
        unit: "imperial"
    },
};