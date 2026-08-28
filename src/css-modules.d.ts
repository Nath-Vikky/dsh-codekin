declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export const styleId: string
  export const styleText: string
  export default classes
}
