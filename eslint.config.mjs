import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      // The design handoff is reference material, not project source.
      "design_handoff_karvon_homepage/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
