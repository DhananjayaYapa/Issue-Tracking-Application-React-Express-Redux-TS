import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { loginUser, registerUser } from "../../redux/thunks";
import { authActions } from "../../redux/slices";
import type { LoginPayload, RegisterPayload } from "../../utilities/models";
import { APP_ROUTES } from "../../utilities/constants";
import styles from "./AuthPage.module.scss";

interface RegisterFormData extends RegisterPayload {
  confirmPassword: string;
}

interface AuthPageProps {
  initialPanel?: "login" | "register";
}

const AuthPage: React.FC<AuthPageProps> = ({ initialPanel = "login" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading, error, registrationSuccess } = useAppSelector((state) => state.auth);

  const [rightPanelActive, setRightPanelActive] = useState(initialPanel === "register");

  useEffect(() => {
    setRightPanelActive(initialPanel === "register");
  }, [initialPanel]);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const loginForm = useForm<LoginPayload>({ defaultValues: { email: "", password: "" } });

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const registerForm = useForm<RegisterFormData>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const regPassword = registerForm.watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname || APP_ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (registrationSuccess) {
      setRightPanelActive(false);
      navigate(APP_ROUTES.LOGIN, { replace: true });
    }
  }, [registrationSuccess, navigate]);

  useEffect(() => {
    return () => {
      dispatch(authActions.clearError());
    };
  }, [dispatch]);

  const handleSwitchPanel = (showRegister: boolean) => {
    dispatch(authActions.clearError());
    setRightPanelActive(showRegister);
    navigate(showRegister ? APP_ROUTES.REGISTER : APP_ROUTES.LOGIN, { replace: true });
  };

  const onLoginSubmit = (data: LoginPayload) => {
    dispatch(loginUser(data));
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _confirmPassword, ...registerData } = data;
    dispatch(registerUser(registerData));
  };

  const containerClass = `${styles.container} ${rightPanelActive ? styles.rightPanelActive : ""}`;

  return (
    <Box className={styles.pageWrapper}>
      <div className={containerClass}>
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <div className={styles.formInner}>
            <h1>Create Account</h1>
            <p>Enter your details to get started</p>

            {error && rightPanelActive && (
              <Alert severity="error" className={styles.errorAlert}>
                {error}
              </Alert>
            )}

            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} noValidate style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Full Name"
                margin="dense"
                size="small"
                error={!!registerForm.formState.errors.name}
                helperText={registerForm.formState.errors.name?.message}
                disabled={isLoading}
                {...registerForm.register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="dense"
                size="small"
                error={!!registerForm.formState.errors.email}
                helperText={registerForm.formState.errors.email?.message}
                disabled={isLoading}
                {...registerForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <TextField
                fullWidth
                label="Password"
                type={showRegPassword ? "text" : "password"}
                margin="dense"
                size="small"
                error={!!registerForm.formState.errors.password}
                helperText={registerForm.formState.errors.password?.message}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowRegPassword(!showRegPassword)} edge="end" size="small">
                        {showRegPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...registerForm.register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type={showRegConfirmPassword ? "text" : "password"}
                margin="dense"
                size="small"
                error={!!registerForm.formState.errors.confirmPassword}
                helperText={registerForm.formState.errors.confirmPassword?.message}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showRegConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...registerForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === regPassword || "Passwords do not match",
                })}
              />

              <Button type="submit" fullWidth disabled={isLoading} className={styles.submitButton}>
                {isLoading && rightPanelActive ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
              </Button>
            </form>
            <div className={styles.mobileToggle}>
              Already have an account? <a onClick={() => handleSwitchPanel(false)}>Sign In</a>
            </div>
          </div>
        </div>

        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <div className={styles.formInner}>
            <h1>Sign In</h1>
            <p>Welcome back! Please sign in to continue</p>

            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="dense"
                size="small"
                error={!!loginForm.formState.errors.email}
                helperText={loginForm.formState.errors.email?.message}
                disabled={isLoading}
                {...loginForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <TextField
                fullWidth
                label="Password"
                type={showLoginPassword ? "text" : "password"}
                margin="dense"
                size="small"
                error={!!loginForm.formState.errors.password || (!!error && !rightPanelActive)}
                helperText={loginForm.formState.errors.password?.message || (!rightPanelActive && error)}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)} edge="end" size="small">
                        {showLoginPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...loginForm.register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />

              <Button type="submit" fullWidth disabled={isLoading} className={styles.submitButton}>
                {isLoading && !rightPanelActive ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
              </Button>
            </form>
            <div className={styles.mobileToggle}>
              Don't have an account? <a onClick={() => handleSwitchPanel(true)}>Sign Up</a>
            </div>
          </div>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className={styles.ghostButton} onClick={() => handleSwitchPanel(false)}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Hello, User!</h1>
              <p>Enter your personal details to start</p>
              <button className={styles.ghostButton} onClick={() => handleSwitchPanel(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AuthPage;
