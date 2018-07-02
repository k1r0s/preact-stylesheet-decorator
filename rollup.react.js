import common from './rollup.common';

export default {
  input: `react.dev.js`,
  output: [
		{ file: 'dist/react-stylesheet-decorator.js', name: 'reactStylesheet', format: 'umd' },
		{ file: 'dist/react-stylesheet-decorator.es.js', format: 'es' },
    { file: 'react.js', name: 'reactStylesheet', format: 'umd' }
  ],
  plugins: common
}
