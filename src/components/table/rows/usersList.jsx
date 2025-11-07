import PropTypes from 'prop-types';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';
import Label from 'src/components/label';
import { styled } from '@mui/material/styles';
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Tooltip,
  ClickAwayListener,
  Paper,
  Grid
} from '@mui/material';
import { MdEdit, MdCheckCircle, MdCancel, MdMoreVert } from 'react-icons/md';
import { FiEye } from 'react-icons/fi';
import { Wallet } from 'lucide-react';
import { fDateShort } from 'src/utils/formatTime';
import BlurImage from 'src/components/blurImage';
import { UsePermission } from 'src/hooks/usePermission';
import { useState } from 'react';
import { Password } from '@mui/icons-material';

UserRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  setId: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

export default function UserRow({
  isLoading,
  row,
  handleClickOpenStatus,
  handleClickOpenTopUp,
  sn,
  userType,
  handleClickOpenPassword
}) {
  const canViewDetails = UsePermission('view_user_details');
  const canEditAdmin = UsePermission('edit_admin_user');
  const canTopUp = UsePermission('top_up');
  const canApprove = UsePermission('approve_user');
  const changePassword = UsePermission('change_password');
  const router = useRouter();

  const [openMore, setOpenMore] = useState(false);

  const handleToggleMore = (event) => {
    event.stopPropagation();
    setOpenMore((prev) => !prev);
  };

  const handleClickAway = () => setOpenMore(false);

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell component="th" scope="row">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : row?.cover?.url ? (
            <ThumbImgStyle>
              <BlurImage priority fill alt={row?.firstName + ' thumbnail'} src={row?.cover?.url} objectFit="cover" />
            </ThumbImgStyle>
          ) : (
            <Avatar color="primary" sx={{ mr: 1 }}>
              {row?.firstName.slice(0, 1)}
            </Avatar>
          )}
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.firstName + ' ' + row?.lastName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell style={{ minWidth: 160 }}>{isLoading ? <Skeleton variant="text" /> : row?.email}</TableCell>
      <TableCell style={{ minWidth: 40 }}>
        {isLoading ? <Skeleton variant="text" /> : row?.currentBalance || 0}
      </TableCell>

      {userType === 'admin' && (
        <TableCell style={{ minWidth: 40, textTransform: 'capitalize' }}>
          {isLoading ? <Skeleton variant="text" /> : row.role?.toLowerCase() === 'vendor' ? 'Influencer' : row.role}
        </TableCell>
      )}

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <div className="col">
            <Label
              sx={{
                width: '70px',
                fontSize: '0.60rem',
                margin: 0.2,
                bgcolor: row?.isActive ? 'success.light' : 'warning.light',
                color: row?.isActive ? 'success.dark' : 'white',
                textTransform: 'capitalize'
              }}
            >
              {row?.isActive ? 'Approved' : 'Draft'}
            </Label>
          </div>
        )}
      </TableCell>

      <TableCell style={{ minWidth: 40 }}>
        {isLoading ? <Skeleton variant="text" /> : fDateShort(row.createdAt, enUS)}
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ position: 'relative' }}>
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          ) : (
            <>
              {/* Always visible actions */}
              {canViewDetails && (
                <Tooltip title="Preview">
                  <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                    <FiEye />
                  </IconButton>
                </Tooltip>
              )}

              {userType === 'admin' && canEditAdmin && (
                <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/admin/admin-users/edit/${row?._id}`)}>
                    <MdEdit />
                  </IconButton>
                </Tooltip>
              )}

              {/* 3 Dots (More Action) */}
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ position: 'relative' }}>
                  <IconButton onClick={handleToggleMore}>
                    <MdMoreVert />
                  </IconButton>

                  {openMore && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        zIndex: 10,
                        minWidth: 200,
                        p: 1,
                        boxShadow: 3,
                        display: 'flex',

                        flexDirection: 'column',
                        gap: 0.5
                      }}
                    >
                      {userType === 'user' && canTopUp && (
                        <IconButton onClick={() => handleClickOpenTopUp(row)}>
                          <Grid sx={{ display: 'flex', width: '100%' }}>
                            <Wallet style={{ width: 30 }} size={23} />
                            <Typography>Top Up</Typography>
                          </Grid>
                        </IconButton>
                      )}

                      {userType != 'user' && changePassword && (
                        <IconButton
                          sx={{ display: 'flex', width: '100%' }}
                          onClick={() => handleClickOpenPassword(row)}
                        >
                          <Password style={{ width: 30 }} size={20} />
                          <Typography>Change Password</Typography>
                        </IconButton>
                      )}

                      {canApprove && (
                        <IconButton onClick={handleClickOpenStatus(row)}>
                          {!row?.isActive ? (
                            <Grid sx={{ display: 'flex', width: '100%' }}>
                              <MdCheckCircle style={{ width: 30 }} color="green" size={23} />
                              <Typography>Approve</Typography>
                            </Grid>
                          ) : (
                            <Grid sx={{ display: 'flex', width: '100%' }}>
                              <MdCancel style={{ width: 30 }} color="orange" size={23} />
                              <Typography>Draft</Typography>
                            </Grid>
                          )}
                        </IconButton>
                      )}
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
