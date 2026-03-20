export type menu = {
  name: string;
  icon?: string;
  route: string | null;
  children?: menu[];
  [key: string]: string | number | undefined | null | menu[];
};
