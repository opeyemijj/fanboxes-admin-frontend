import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch } from 'react-redux';

// mui
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Rating, Tooltip } from '@mui/material';

// redux

// components
import BlurImage from 'src/components/blurImage';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { selectBoxAndItem } from 'src/redux/slices/product';
import { UsePermission } from 'src/hooks/usePermission';

export default function BoxItemRow({ isLoading, row, handleClickOpen, isVendor, sn, boxDetails }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const canEdit = UsePermission('edit_box_item');
  const canDelete = UsePermission('delete_box_item');

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

      <TableCell>
        <Typography>{row?.value} </Typography>
      </TableCell>

      <TableCell align="left">
        {isLoading ? <Skeleton variant="text" /> : <Typography>{row?.weight} </Typography>}
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
            {canEdit && (
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    const tempData = { item: row, slug: boxDetails.slug };
                    dispatch(selectBoxAndItem(tempData));
                    router.push(`/${isVendor ? 'vendor' : 'admin'}/products/editItem/${row.slug}`);
                  }}
                >
                  <MdEdit />
                </IconButton>
              </Tooltip>
            )}

            {canDelete && (
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row?.slug)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            )}
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
