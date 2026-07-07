import { ModeVariant, ThemeVariant } from "@/constants";
import { ContentType, MenuType } from "@/types/types";

export const DEFAULTS = {
  appRoot: "/dashboards/default",
  locale: "en",
  themeColor: "theme-green" as ThemeVariant,
  themeMode: "light" as ModeVariant,
  contentType: ContentType.Fluid,
  leftMenuType: MenuType.SingleLayer,
  leftMenuWidth: {
    [MenuType.Minimal]: { primary: 60, secondary: 260 },
    [MenuType.Comfort]: { primary: 116, secondary: 260 },
    [MenuType.SingleLayer]: { primary: 280, secondary: 0 },
  },
  transitionDuration: 150,
};
