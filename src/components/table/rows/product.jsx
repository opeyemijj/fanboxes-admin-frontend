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
import {
  MdCheck,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChecklist,
  MdCheckroom,
  MdEdit,
  MdIndeterminateCheckBox,
  MdOutlineCheckBoxOutlineBlank
} from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import Link from 'next/link';
import { Check, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

export default function ProductRow({ isLoading, row, handleClickOpen, handleClickOpenStatus, isVendor, sn }) {
  // console.log(row, 'Check the row?');
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
                blurDataURL={row?.image.blurDataURL}
                src={row?.image.url}
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
                alt={row?.shopDetails?.title}
                blurDataURL={row?.shopDetails?.logo?.blurDataURL}
                placeholder="blur"
                src={row?.shopDetails?.logo?.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="" noWrap>
            <div>{row?.shopDetails?.title}</div>
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.ownerType}</TableCell>
      <TableCell align="center">
        {isLoading ? <Skeleton variant="text" /> : row?.visitedCount ? row?.visitedCount : 0}
      </TableCell>

      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          // <Rating name="text-feedback" size="small" value={row?.averageRating || 0} readOnly precision={0.5} />
          // vendor/product/slug (slug of box) from api
          <Link href={`products/box/${row?.slug}`} passHref>
            <Typography>{row?.items?.length || 0} Item(s)</Typography>
          </Link>
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row?.priceSale || row?.price)}</TableCell>
      {/* <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.status}</TableCell> */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant="filled"
            sx={{
              width: '80px',
              bgcolor:
                row?.status === 'approved'
                  ? 'success.light'
                  : row?.status === 'pending'
                    ? 'info.light'
                    : row?.status === 'rejected' || row?.status === 'blocked'
                      ? 'error.light'
                      : 'warning.light',
              color:
                row?.status === 'approved'
                  ? 'success.dark'
                  : row?.status === 'pending'
                    ? 'info.dark'
                    : row?.status === 'rejected' || row?.status === 'blocked'
                      ? 'error.dark'
                      : 'warning.dark',
              textTransform: 'capitalize'
            }}
          >
            {row?.status}
          </Label>
        )}
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row?.createdAt, enUS)}</>}</TableCell>

      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Tooltip title={row?.isActive ? 'Aactive' : 'Inactive'}>
              <IconButton onClick={handleClickOpenStatus(row)}>
                {row.isActive ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Preview">
              <Link target="_blank" href={`${process.env.USER_FRONTEND_URL}/boxes/${row.slug}`}>
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
ProductRow.propTypes = {
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
