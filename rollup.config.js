import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import babili from 'rollup-plugin-babili';

export default {
  entry: 'dist.js',
  format: 'iife',
  plugins: [
    commonJs(),
    resolve(),
    babili({
      comments: false
    })
  ],
  dest: 'dist/index.js'
};
