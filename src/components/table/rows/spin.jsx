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
import { selectSpinItem } from 'src/redux/slices/product';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  Check,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankOutlined,
  CheckBoxTwoTone,
  CheckCircle,
  Verified,
  VerifiedRounded,
  VerifiedSharp
} from '@mui/icons-material';
import { BsFillShieldFill, BsShieldCheck, BsPlayCircle, BsSendCheck, BsSignMergeRight } from 'react-icons/bs';
export default function ProductRow({ isLoading, row, handleClickOpen, sn }) {
  const dispatch = useDispatch();
  const router = useRouter();
  function shortenString(str, remainChar, showDots) {
    if (str.length <= remainChar) {
      return str; // return as is if string is 10 chars or less
    }
    if (showDots) {
      return str.slice(0, remainChar) + '...';
    } else {
      return str.slice(0, remainChar);
    }
  }

  function formatDateToDDYYYYMM(dateString) {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.boxDetails?.name}</>}</TableCell>
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
                alt={row?.winningItem?.name}
                blurDataURL={row?.winningItem?.images[0]?.blurDataURL}
                placeholder="blur"
                src={row?.winningItem?.images[0]?.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="">
            <div>{row?.winningItem?.name}</div>
            <div>${row?.winningItem?.value}</div>
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <>{`${Number(row?.winningItem?.odd)?.toFixed(4)}/${row?.winningItem?.weight}%`}</>
        )}
      </TableCell>

      <TableCell
        title={row?.clientSeed} // full value on hover
      >
        {isLoading ? <Skeleton variant="text" /> : <>{row?.clientSeed}</>}
      </TableCell>

      <TableCell title={row?.serverSeed}>
        {isLoading ? <Skeleton variant="text" /> : <>{shortenString(row?.serverSeed, 10, true)}</>}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <>{shortenString(row?.userDetails?.firstName + ' ' + row?.userDetails?.lastName, 13, false)}</>
        )}
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{formatDateToDDYYYYMM(row?.createdAt)}</>}</TableCell>

      <TableCell align="left">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center">
            <BsShieldCheck
              size={17}
              onClick={() => {
                const tempData = { spinItem: row };
                dispatch(selectSpinItem(tempData));
                router.push(`/admin/spins/${row._id}`);
              }}
            >
              <IoEye />
            </BsShieldCheck>
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
