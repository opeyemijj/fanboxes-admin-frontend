import PropTypes from 'prop-types';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Avatar, Tooltip } from '@mui/material';

// utils
import { fDateShort } from 'src/utils/formatTime';

// icons
import { FiEye } from 'react-icons/fi';
import { LuUser2 } from 'react-icons/lu';
import { FaUserCheck } from 'react-icons/fa6';

// component
import BlurImage from 'src/components/blurImage';

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
export default function UserRow({ isLoading, row, setId, sn }) {
  const router = useRouter();
  console.log(row, 'row data');
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
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.firstName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell style={{ minWidth: 160 }}>{isLoading ? <Skeleton variant="text" /> : row?.email}</TableCell>
      <TableCell style={{ minWidth: 80 }}>{isLoading ? <Skeleton variant="text" /> : row?.phone}</TableCell>
      <TableCell style={{ minWidth: 40 }}>{isLoading ? <Skeleton variant="text" /> : row?.totalOrders || 0}</TableCell>
      <TableCell style={{ minWidth: 40, textTransform: 'capitalize' }}>
        {isLoading ? <Skeleton variant="text" /> : row.role?.toLowerCase() === 'vendor' ? 'Influencer' : row.role}
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
              <Tooltip title="Preview">
                <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                  <FiEye />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
