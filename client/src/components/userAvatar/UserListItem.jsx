import { Box, Avatar, Typography } from '@mui/material';

const UserListItem = ({ user, handleFunction }) => {

  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: 'pointer',
        backgroundColor: '#E8E8E8',
        '&:hover': {
          backgroundColor: '#38B2AC',
          color: 'white',
        },
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        px: 3,
        py: 2,
        mb: 2,
        borderRadius: 'lg',
      }}
    >
      <Avatar
        sx={{ mr: 2 }}
        size="sm"
        src={user.pic}
      >
        {user.name}
      </Avatar>
      <Box>
        <Typography>{user.name}</Typography>
        <Typography variant="caption" display="block">
          <b>Email :</b> {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
