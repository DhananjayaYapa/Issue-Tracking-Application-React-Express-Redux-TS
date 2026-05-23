import { createTheme, styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Breadcrumbs } from "@mui/material";

const primaryFontSize = 14;

const glassSurface = {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  backdropFilter: "blur(8px)",
  color: "#ffffff",
};

export const PrimaryTheme = createTheme({
  palette: {
    primary: { main: "#0166fe" },
    secondary: { main: "#fff9d1" },
    background: {
      default: "#0d0931",
      paper: "transparent",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.15)",
    action: {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: ["PT Sans", "sans-serif"].join(","),
    fontSize: primaryFontSize,
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightBold: 700,
    body1: { fontSize: primaryFontSize },
  },
  components: {
    // Paper — transparent glass surface
    MuiPaper: {
      styleOverrides: {
        root: {
          ...glassSurface,
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassSurface,
          boxShadow: "none",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06) !important",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0166fe",
          },
        },
        input: { fontSize: primaryFontSize },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          "&.Mui-focused": {
            color: "#0166fe",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    // Button outlined variant
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "#ffffff",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    // Switch
    MuiSwitch: {
      styleOverrides: {
        track: {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        },
      },
    },
    // FormControlLabel
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "rgba(255, 255, 255, 0.85)",
        },
      },
    },
    // Popover / Menu
    MuiPopover: {
      styleOverrides: {
        paper: (themeParam) => ({
          ...glassSurface,
          backgroundColor: "rgba(20, 18, 50, 0.95)",
          boxShadow: themeParam.theme.shadows[3],
          fontSize: primaryFontSize,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: primaryFontSize,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          ...glassSurface,
          backgroundColor: "rgba(20, 18, 50, 0.95)",
        },
      },
    },
    // Chip
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "#ffffff",
        },
      },
    },
    // Typography
    MuiTypography: {
      styleOverrides: {
        paragraph: { fontSize: primaryFontSize },
      },
    },
    // Alert
    MuiAlert: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
      },
    },
    // Snackbar Alert content
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});

export const StyledTableCell = styled(TableCell)(() => ({
  "&.MuiTableCell-head": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    fontWeight: 600,
    padding: "10px",
    color: "#ffffff",
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
    padding: "6px",
    color: "#ffffff",
  },
}));

export const StyledTableBoldCell = styled(TableCell)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  fontSize: 14,
  fontWeight: 600,
  padding: "10px",
  color: "#ffffff",
}));

export const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
}));

export const AppBreadcrumb = styled(Breadcrumbs)({
  fontSize: "13px",
  "& .MuiBreadcrumbs-separator": {
    marginLeft: 4,
    marginRight: 4,
  },
});

// Common pagination styles
export const paginationSx = {
  color: "rgba(255, 255, 255, 0.6)",
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 300,
  },
  "& .MuiTablePagination-select": {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 600,
  },
  "& .MuiTablePagination-selectIcon": {
    color: "rgba(255, 255, 255, 0.6)",
  },
  "& .MuiIconButton-root": {
    color: "rgba(255, 255, 255, 0.6)",
  },
};
