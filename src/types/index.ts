export type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

export type WithClassName<T = object> = T & { className?: string };
