import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
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
  Link
} from '@mui/material';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

import BlurImageAvatar from 'src/components/avatar';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { CheckBox, CheckBoxOutlineBlank, Dangerous } from '@mui/icons-material';
export default function ProductRow({
  isLoading,
  row,
  handleClickOpen,
  handleClickOpenStatus,
  handleClickOpenBanned,
  sn
}) {
  const router = useRouter();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '6px',
                img: {
                  borderRadius: '2px'
                }
              }}
            >
              <BlurImage
                alt={row?.name}
                blurDataURL={row?.logo?.blurDataURL}
                placeholder="blur"
                src={row?.logo?.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.title}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row.products?.length || 0}</>}</TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <div className="col">
            {row?.isBanned ? (
              <Label
                sx={{ bgcolor: 'error.light', color: 'white', width: '70px', fontSize: '0.60rem', margin: 0.2 }}
                variant="filled"
              >
                {row?.isBanned ? 'Banned' : ''}
              </Label>
            ) : (
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
            )}
          </div>
        )}
      </TableCell>
      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            {!row?.isBanned && (
              <Tooltip title={row?.isActive ? 'Aactive' : 'Inactive'}>
                <IconButton onClick={handleClickOpenStatus(row)}>
                  {row.isActive ? <CheckBox /> : <CheckBoxOutlineBlank />}
                </IconButton>
              </Tooltip>
            )}

            <Link href={`/admin/shops/${row.slug}`}>
              <IconButton>
                <IoEye />
              </IconButton>
            </Link>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/admin/shops/edit/${row.slug}`)}>
                <MdEdit />
              </IconButton>
            </Tooltip>

            <Tooltip title={!row.isBanned ? 'Ban' : 'Unban'}>
              <IconButton onClick={handleClickOpenBanned(row)}>
                <Dangerous color={row.isBanned ? 'error' : ''} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen(row.slug)}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    products: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    vendor: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    approved: PropTypes.bool.isRequired,
    approvedAt: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
