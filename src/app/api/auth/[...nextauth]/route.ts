// Müvəqqəti həll - Production URL-ni kodda veririk
process.env.NEXTAUTH_URL = "https://slideazi.vercel.app";

import { handlers } from "@/server/auth";
export const { GET, POST } = handlers;
