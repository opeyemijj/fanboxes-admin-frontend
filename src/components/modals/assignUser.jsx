'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import toast from 'react-hot-toast';
import * as api from 'src/services';

export default function AssignUsersModal({ open, onClose, markItem, onAssign, assignLoading }) {
  const [assignUsers, setAssignUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      setSelectedUsers(markItem?.assignTo || []);
      setSelectedUserDetails(markItem?.assignToDetails || []);
      fetchUsers();
    }
  }, [open, markItem]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.getRoleWiseUserToAssign(1, '', 'admin');
      setAssignUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle user checkbox toggle
  const handleToggleUser = (user) => {
    setSelectedUsers((prev) => (prev.includes(user._id) ? prev.filter((id) => id !== user._id) : [...prev, user._id]));

    setSelectedUserDetails((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      return exists
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, { _id: user._id, firstName: user.firstName, lastName: user.lastName }];
    });
  };

  // Filtered users based on search
  const filteredUsers = assignUsers.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    onAssign({
      slug: markItem?.slug || markItem?._id,
      selectedUsers,
      selectedUserDetails
    });
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <WarningRoundedIcon sx={{ mr: 1 }} color="primary" />
        Assign Users
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>Select one or more users to assign.</DialogContentText>

        {/* Fixed height container */}
        <Box sx={{ height: 420, display: 'flex', flexDirection: 'column' }}>
          {/* Search Input */}
          <TextField
            variant="outlined"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <WarningRoundedIcon sx={{ mr: 1, color: 'action.active' }} fontSize="small" />
            }}
            sx={{ mb: 2 }}
          />

          {/* Select All Checkbox */}
          {filteredUsers.length > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: '1px solid #eee',
                mb: 1,
                backgroundColor: 'action.hover'
              }}
            >
              <Checkbox
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(filteredUsers.map((u) => u._id));
                    setSelectedUserDetails(
                      filteredUsers.map((u) => ({
                        _id: u._id,
                        firstName: u.firstName,
                        lastName: u.lastName
                      }))
                    );
                  } else {
                    setSelectedUsers([]);
                    setSelectedUserDetails([]);
                  }
                }}
              />
              <Typography variant="body1">Select All</Typography>
            </Stack>
          )}

          {/* Content Area */}
          <Box sx={{ flex: 1, overflowY: 'auto', borderRadius: 1, border: '1px solid #eee', p: 1 }}>
            {loadingUsers ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                <CircularProgress />
              </Stack>
            ) : (
              <Stack spacing={1}>
                {filteredUsers.length === 0 && <DialogContentText align="center">No users found.</DialogContentText>}

                {filteredUsers.map((user) => (
                  <Stack
                    key={user._id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      transition: 'background 0.2s',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleToggleUser(user)} />
                    <Typography variant="body1">{`${user.firstName} ${user.lastName}`}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          {selectedUsers.length > 0 ? `${selectedUsers.length} user(s) selected` : 'No user selected'}
        </Typography>
        <Box>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            loading={assignLoading}
            disabled={selectedUsers.length < 1}
            variant="contained"
            onClick={handleAssign}
          >
            Assign
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

AssignUsersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  markItem: PropTypes.object,
  onAssign: PropTypes.func.isRequired,
  assignLoading: PropTypes.bool
};
