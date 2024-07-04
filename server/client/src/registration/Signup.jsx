import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Avatar, Button, Grid, Box, Typography, Container, TextField, InputAdornment, IconButton, FormControl, Input } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ChatState } from "../context/ChatProvider";

const SignUp = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [picLoading, setPicLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { pic, setPic } = ChatState();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/chats");
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast.warning("Please fill all the fields", {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast.warning("Passwords do not match", {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPicLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                `/api/user`,
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            console.log(data);
            toast.success("Registration successful", {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/chats");
            setPicLoading(false);
        } catch (error) {
            toast.error(`Error occurred! ${error.response.data.message}`, {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPicLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!selectedFile || (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png")) {
            toast.warning("Please select a JPEG or PNG image", {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "kanak-acharya");

        setPicLoading(true);

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/kanak-acharya/image/upload',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setPic(response.data.secure_url);
            toast.success("Image uploaded successfully", {
                position: "bottom",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPicLoading(false);
        } catch (error) {
            console.error("Error uploading image:", error);
            setPicLoading(false);
        }
    };


    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#00897b' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={submitHandler}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={show ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmpassword"
                                    label="Confirm Password"
                                    type={show ? "text" : "password"}
                                    id="confirmpassword"
                                    autoComplete="new-password"
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClick}
                                                    edge="end"
                                                >
                                                    {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Input
                                    id="pic"
                                    type="file"
                                    inputProps={{ accept: "image/*" }}
                                    onChange={handleFileChange} />
                                <Button
                                    onClick={handleImageUpload}
                                    startIcon={<CloudUploadIcon />}
                                    disabled={picLoading}
                                >
                                    {picLoading ? 'Uploading.....' : 'Upload file'}
                                </Button>
                            </FormControl>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={picLoading}
                        >
                            {picLoading ? 'Loading...' : 'Sign Up'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login" className="font-medium text-[#00a3d9] hover:underline dark:text-[#00d9ff]">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <ToastContainer />
            </Container>
        </>
    );
}

export default SignUp;
