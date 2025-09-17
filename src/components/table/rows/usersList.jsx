import PropTypes from 'prop-types';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';
import Label from 'src/components/label';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Avatar, Tooltip } from '@mui/material';
import { MdEdit, MdBlock, MdCheckCircle, MdCancel } from 'react-icons/md';

// utils
import { fDateShort } from 'src/utils/formatTime';

// component
import BlurImage from 'src/components/blurImage';
import { UsePermission } from 'src/hooks/usePermission';
import { Banknote, CreditCardIcon, Edit, TrendingUp, Wallet } from 'lucide-react';

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
export default function UserRow({ isLoading, row, setId, handleClickOpenStatus, handleClickOpenTopUp, sn, userType }) {
  const canViewDetails = UsePermission('view_user_details');

  const canEditAdmin = UsePermission('edit_admin_user');
  const canTopUp = UsePermission('top_up');
  const canApprove = UsePermission('approve_user');
  const router = useRouter();

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
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
      <TableCell>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          ) : (
            <>
              {/* {canViewDetails && (
                <Tooltip title="Preview">
                  <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                    <FiEye />
                  </IconButton>
                </Tooltip>
              )} */}

              {userType === 'admin' && canEditAdmin && (
                <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/admin/admin-users/edit/${row?._id}`)}>
                    <MdEdit />
                  </IconButton>
                </Tooltip>
              )}

              {userType === 'user' && canTopUp && (
                <Tooltip title="Top Up">
                  <IconButton onClick={() => handleClickOpenTopUp(row)}>
                    <Wallet />
                  </IconButton>
                </Tooltip>
              )}

              {canApprove && (
                <Tooltip title={!row?.isActive ? 'Approve' : 'Draft'}>
                  <IconButton onClick={handleClickOpenStatus(row)}>
                    {!row?.isActive ? (
                      <MdCheckCircle style={{ width: 30 }} color="green" size={23} />
                    ) : (
                      <MdCancel style={{ width: 30 }} width={50} color="orange" size={23} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
