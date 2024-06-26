import type { Meta, StoryObj } from "@storybook/react";

import Footer from "./index";

const meta = {
    title: "weather app/organisms/Footer",
    component: Footer,
    tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Base: Story = {};