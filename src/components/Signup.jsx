import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
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
          SIGN UP
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" onChange={(e) => setPassword(e.target.value)} />
          <FormControlLabel control={<Checkbox color="primary" />} label="Remember me?" />
          <Button fullWidth variant="contained" color="secondary" type="submit" sx={{ mt: 2, py: 1.5 }}>
            SIGN UP
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>OR</Divider>
        
        {/* Google Signup Button */}
        <Box display="flex" justifyContent="center">
          <Button variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignup} sx={{ textTransform: "none" }}>
            Sign up with Google
          </Button>
        </Box>

        <Typography align="center" mt={2}>
          Already have an account? <a href="/" style={{ color: "#FF4081", fontWeight: "bold" }}>LOGIN</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
