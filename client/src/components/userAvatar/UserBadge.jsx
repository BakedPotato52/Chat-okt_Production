import React from 'react';
import { Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Chip
            label={`${user.name}${admin === user._id ? ' (Admin)' : ''}`}
            onDelete={handleFunction}
            deleteIcon={<CloseIcon />}
            color="primary"
            variant="outlined"
            sx={{ margin: '4px' }}
        />
    );
};

export default UserBadgeItem;
