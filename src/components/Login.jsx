import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={4} boxShadow={3} borderRadius={3} bgcolor="white">
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          LOGIN
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" onChange={(e) => setPassword(e.target.value)} />
          <FormControlLabel control={<Checkbox color="primary" />} label="Remember me?" />
          <Button fullWidth variant="contained" color="secondary" type="submit" sx={{ mt: 2, py: 1.5 }}>
            LOGIN
          </Button>
        </form>
        <Typography align="center" mt={2} color="primary">
          <a href="/forgot-password">Forgot Password?</a>
        </Typography>

        <Divider sx={{ my: 2 }}>OR</Divider>
        
        {/* Google Login Button */}
        <Box display="flex" justifyContent="center">
          <Button variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin} sx={{ textTransform: "none" }}>
            Sign in with Google
          </Button>
        </Box>

        <Typography align="center" mt={2}>
          Need an account? <a href="/signup" style={{ color: "#FF4081", fontWeight: "bold" }}>SIGN UP</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
