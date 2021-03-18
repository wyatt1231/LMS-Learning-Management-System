import { Color } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core/styles";

interface ThemeProp {
  appbar: IAppBar;
}

interface IAppBar {
  bgColor: string;
  color: string;
  height: number;
}

interface IBodyStyles {
  backgroundColor: string;
}

export interface StyledComponentTheme {
  theme: Theme;
}

declare module "@material-ui/core/styles/createMuiTheme" {
  interface ThemeOptions {
    header?: IHeader;
    sidebar?: ISidebar;
    body?: IBodyStyles;
  }

  interface IHeader {
    height: number;
    backgroundColor: string;
    color: string;
    fontFamily: string;
  }

  interface ISidebar {
    maxWidth: number;
    minWidth: number;
    backgroundColor: string;
    color: string;
  }
}

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    blue: Color;
    bg: Color;
  }

  interface PaletteOptions {
    blue?: PaletteOptions["primary"];
  }
}

let theme = createMuiTheme({
  palette: {
    primary: {
      main: `#1e2a78`,
    },
    secondary: {
      // main: `#f3f169`,
      main: `#ff1f5a`,
    },
  },
  typography: {
    button: {
      // textTransform: "unset",
      fontWeight: 500,
      fontSize: `.8em`,
    },
    fontFamily: [
      "lato",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  header: {
    backgroundColor: "#fff",
    height: 65,
    color: "black",
    fontFamily: "Lato",
  },
  sidebar: {
    maxWidth: 300,
    minWidth: 65,
    backgroundColor: "#black",
    color: "black",
  },
  body: {
    backgroundColor: " #edfcff",
  },
});

theme = responsiveFontSizes(theme);
export default theme;
