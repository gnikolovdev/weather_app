import type { Meta, StoryObj } from "@storybook/react";

import UnitSwitcher from "./index";

const meta = {
    title: "weather app/molecules/UnitSwitcher",
    component: UnitSwitcher,
    tags: ["autodocs"],
    parameters: {
        backgrounds: {
            default: "dark",
            values: [
              { name: "dark", value: "#808080" },
            ],
          },
    }
} satisfies Meta<typeof UnitSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Celsius: Story = {
    args: {
        unit: "metric"
    },
  };

export const Fahrenheit: Story = {
    args: {
        unit: "imperial"
    },
};