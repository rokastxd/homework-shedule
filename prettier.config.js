/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'none',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    endOfLine: 'lf'
}

export default config
