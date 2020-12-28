export type WrapperComponent =
  (props: { children: string | JSX.Element | Array<string | JSX.Element> }) =>
    JSX.Element