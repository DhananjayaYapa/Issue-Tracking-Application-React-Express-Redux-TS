import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Search as SearchIcon,
  Block as DisableIcon,
  CheckCircle as EnableIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { alertActions } from "../../redux/slices";
import { fetchUsers, enableUser, disableUser, permanentDeleteUser } from "../../redux/thunks";
import { ConfirmationDialog, LoadingOverlay, PageHeader } from "../../components/shared";
import { formatDate } from "../../utilities/helpers/commonFunctions";
import { APP_TABLE_CONFIG, USER_ROLES } from "../../utilities/constants";
import { paginationSx, StyledTableCell, StyledTableRow } from "../../assets/theme/theme";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);
  const currentUser = useAppSelector((state) => state.auth.user);
  const alert = useAppSelector((state) => state.alert);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    userId: null as number | null,
    userName: "",
    actionType: "disable" as "disable" | "enable" | "permanent",
  });
  const [searchInput, setSearchInput] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const filteredUsers = users.filter((user) => {
    if (!searchInput.trim()) return true;
    const searchTerm = searchInput.trim().toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const paginatedData = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getConfirmDialogContent = () => {
    const { actionType, userName } = deleteConfirm;
    if (actionType === "permanent") {
      return {
        title: "Permanently Delete User",
        message: `Are you sure you want to permanently delete "${userName}"? This action cannot be undone.`,
      };
    }
    if (actionType === "enable") {
      return {
        title: "Enable User",
        message: `Are you sure you want to enable "${userName}"? The user will be able to access the system again.`,
      };
    }
    return {
      title: "Disable User",
      message: `Are you sure you want to disable "${userName}"? The user will no longer be able to access the system.`,
    };
  };

  const confirmDialogContent = getConfirmDialogContent();

  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <PageHeader subtitle={`${filteredUsers.length} users found`} />

        <Box sx={{ mb: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280, "& .MuiOutlinedInput-root": { borderRadius: 50 } }}
            />
          </Grid>
        </Box>

        {alert?.message && (
          <Alert severity={alert.severity ?? "info"} onClose={() => dispatch(alertActions.clearAlert())} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <LoadingOverlay loading={isLoading} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        {searchInput ? "No users match your search" : "No users found"}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  paginatedData.map((user) => (
                    <StyledTableRow
                      key={user.id}
                      hover
                      sx={{
                        ...(user.role === USER_ROLES.ADMIN
                          ? { "& td.MuiTableCell-body": { color: "#0166fe !important" } }
                          : {}),
                        ...(user.isEnabled === false ? { opacity: 0.6 } : {}),
                      }}
                    >
                      <StyledTableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {user.role === USER_ROLES.ADMIN ? (
                            <AdminIcon color="primary" fontSize="small" />
                          ) : (
                            <UserIcon color="action" fontSize="small" />
                          )}
                          {user.name}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{user.email}</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          size="small"
                          color={user.role === USER_ROLES.ADMIN ? "primary" : "default"}
                          variant="outlined"
                          sx={user.role === USER_ROLES.ADMIN ? { borderColor: "#0166fe", color: "#0166fe" } : {}}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={user.isEnabled !== false ? "ENABLED" : "DISABLED"}
                          size="small"
                          color={user.isEnabled !== false ? "success" : "error"}
                          variant="outlined"
                        />
                      </StyledTableCell>
                      <StyledTableCell>{user.createdAt ? formatDate(user.createdAt) : "-"}</StyledTableCell>
                      <StyledTableCell align="right">
                        {user.role !== USER_ROLES.ADMIN && user.id !== currentUser?.id && (
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            {user.isEnabled !== false ? (
                              <Tooltip title="Disable User">
                                <IconButton
                                  color="warning"
                                  size="small"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      userId: user.id,
                                      userName: user.name,
                                      actionType: "disable",
                                    })
                                  }
                                >
                                  <DisableIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Enable User">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      userId: user.id,
                                      userName: user.name,
                                      actionType: "enable",
                                    })
                                  }
                                >
                                  <EnableIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Permanently Delete User">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    userId: user.id,
                                    userName: user.name,
                                    actionType: "permanent",
                                  })
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredUsers.length > 0 && (
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
            sx={paginationSx}
          />
        )}
      </Box>

      <ConfirmationDialog
        open={deleteConfirm.open}
        title={confirmDialogContent.title}
        message={confirmDialogContent.message}
        onConfirm={() => {
          if (deleteConfirm.userId) {
            if (deleteConfirm.actionType === "permanent") {
              dispatch(permanentDeleteUser({ id: deleteConfirm.userId }));
            } else if (deleteConfirm.actionType === "enable") {
              dispatch(enableUser({ id: deleteConfirm.userId }));
            } else {
              dispatch(disableUser({ id: deleteConfirm.userId }));
            }
          }
          setDeleteConfirm({ open: false, userId: null, userName: "", actionType: "disable" });
        }}
        onCancel={() => setDeleteConfirm({ open: false, userId: null, userName: "", actionType: "disable" })}
      />
    </Box>
  );
};

export default Users;
