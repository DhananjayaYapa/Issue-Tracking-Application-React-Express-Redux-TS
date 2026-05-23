import {
  RadioButtonUnchecked as OpenIcon,
  Autorenew as InProgressIcon,
  CheckCircleOutline as ResolvedIcon,
  HighlightOff as ClosedIcon,
  ArrowDownward as LowIcon,
  ArrowForward as MediumIcon,
  ArrowUpward as HighIcon,
  PriorityHigh as CriticalIcon,
} from "@mui/icons-material";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Open":
      return <OpenIcon color="info" />;
    case "In Progress":
      return <InProgressIcon color="warning" />;
    case "Resolved":
      return <ResolvedIcon color="success" />;
    case "Closed":
      return <ClosedIcon color="disabled" />;
    default:
      return <OpenIcon />;
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Low":
      return <LowIcon color="disabled" />;
    case "Medium":
      return <MediumIcon color="primary" />;
    case "High":
      return <HighIcon color="warning" />;
    case "Critical":
      return <CriticalIcon color="error" />;
    default:
      return <MediumIcon />;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
