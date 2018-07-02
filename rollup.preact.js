import common from './rollup.common';

export default {
  input: `preact.dev.js`,
  output: [
		{ file: 'dist/preact-stylesheet-decorator.js', name: 'preactStylesheet', format: 'umd' },
		{ file: 'dist/preact-stylesheet-decorator.es.js', format: 'es' },
    { file: 'preact.js', name: 'preactStylesheet', format: 'umd' }
  ],
  plugins: common
}
