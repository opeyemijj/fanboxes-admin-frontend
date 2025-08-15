import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { enUS } from 'date-fns/locale';

// mui
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Rating, Tooltip } from '@mui/material';

// redux
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import Link from 'next/link';

export default function BoxItemRow({ isLoading, row, handleClickOpen, isVendor, sn }) {
  console.log(row, 'Check the row?');
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
                placeholder="blur"
                blurDataURL={row?.images[0]?.blurDataURL}
                src={row?.images[0]?.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCell>
        <Skeleton variant="text" />
      </TableCell> */}

      <TableCell align="left">
        {isLoading ? <Skeleton variant="text" /> : <Typography>{row?.weight} </Typography>}
      </TableCell>
      <TableCell>
        <Typography>{row?.value} </Typography>
      </TableCell>
      <TableCell>
        <Typography>{row?.odd} </Typography>
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
            <Tooltip title="Preview">
              <Link target="_blank" href={`/product/${row.slug}`}>
                <IconButton>
                  <IoEye />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/products/${row.slug}`)}>
                <MdEdit />
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
BoxItemRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,

  row: PropTypes.shape({
    image: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    available: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,

  handleClickOpen: PropTypes.func.isRequired
};
