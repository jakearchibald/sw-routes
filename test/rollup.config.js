import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import babili from 'rollup-plugin-babili';

export default {
  entry: 'src.js',
  format: 'iife',
  plugins: [
    commonJs(),
    resolve(),
    babili({
      comments: false
    })
  ],
  dest: 'build.js'
};
