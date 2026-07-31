export type NavigationItem =
  | "explorer"
  | "ai"
  | "terminal"
  | "settings";

export interface NavigationContextValue {
  activeItem: NavigationItem;
  setActiveItem: (item: NavigationItem) => void;
}