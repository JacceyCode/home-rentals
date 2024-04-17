declare module "*.scss" {
  interface IScssVariables {
    pinkred: string;
    blue: string;
    lightgrey: string;
    grey: string;
    darkgrey: string;
  }
  const variables: IScssVariables;
  export default variables;
}
