import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: [
    {
      file: "build/bundle.js",
      format: "cjs"
    }
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
      plugins: ["@babel/plugin-external-helpers"]
    })
  ],
  external: ["object-hash"]
};
