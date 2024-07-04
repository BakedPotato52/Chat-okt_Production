import * as React from 'react';
import PropTypes from 'prop-types';
import { CiSquareInfo } from "react-icons/ci";
import {
    IconButton,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
} from "@mui/material";
import { Label } from '@mui/icons-material';

const ProfileModal = ({ user, children }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!user) {
        return null; // or return some fallback UI
    }

    return (
        <>
            {children ? (
                <span onClick={handleOpen}>{children}</span>
            ) : (
                <IconButton onClick={handleOpen}>
                    <CiSquareInfo />
                </IconButton>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="profile-dialog-title"
                aria-describedby="profile-dialog-description"
            >
                <DialogTitle id="profile-dialog-title">Profile</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center gap-4">
                        <Avatar src={user.pic} className="h-20 w-20" />
                        <div className="text-center">
                            <div className="text-xl font-bold">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            defaultValue={user.name}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            defaultValue={user.email}
                            type="email"
                            variant="outlined"
                        />
                        <div className="flex items-center gap-4 mt-4">
                            <Label htmlFor="avatar" className="text-right">
                                Avatar
                            </Label>
                            <Avatar src={user.pic} className="h-12 w-12" />
                            <Button variant="outlined">Change</Button>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="contained" color="primary" onClick={handleClose}>
                            Save changes
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

ProfileModal.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        pic: PropTypes.string.isRequired,
    }),
    children: PropTypes.node,
};

export default ProfileModal;
