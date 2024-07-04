import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Paper,
} from '@mui/material';
import Login from '../registration/Login';
import SignUp from '../registration/Signup';

function Homepage() {
    const history = useNavigate();
    const [value, setValue] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user) history('/chats');
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
            <Paper elevation={3} style={{ padding: '20px', width: '100%', marginBottom: '15px', textAlign: 'center' }}>
                <Typography variant="h4" component="h1" style={{ fontFamily: 'Work sans' }}>
                    Chat App
                </Typography>
            </Paper>
            <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" textColor="primary" indicatorColor="primary">
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                </Tabs>
                <Box padding={3}>
                    <TabPanel value={value} index={0}>
                        <Login />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <SignUp />
                    </TabPanel>
                </Box>
            </Paper>
        </Container>
    );
}

// Custom TabPanel component to show/hide content based on the selected tab
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default Homepage;
