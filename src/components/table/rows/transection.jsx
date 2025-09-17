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
import { selectSpinItem } from 'src/redux/slices/spin';

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
import { UsePermission } from 'src/hooks/usePermission';
import { capitalize } from 'lodash';
export default function TransectionRow({ isLoading, row, handleClickOpen, sn }) {
  const canVerify = UsePermission('verify_spin');
  const dispatch = useDispatch();
  const router = useRouter();
  function shortenString(str, remainChar, showDots) {
    if (str?.length <= remainChar) {
      return str; // return as is if string is 10 chars or less
    }
    if (showDots) {
      return str?.slice(0, remainChar) + '...';
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

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{capitalize(row?.transactionType)}</>}</TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <>{capitalize(row?.userData?.firstName || '' + ' ' + row?.userData?.lastName || '') || ''}</>
        )}
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{capitalize(row?.paymentMethod)}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.amount}</>}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.description}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.referenceId}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{capitalize(row?.status)}</>}</TableCell>

      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : <>{formatDateToDDYYYYMM(row?.createdAt) || ''}</>}
      </TableCell>

      {/* <TableCell align="left">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center">
            <Tooltip title="Verify Spin">
              {canVerify && (
                <BsShieldCheck
                  size={17}
                  onClick={() => {
                    const tempData = { spinItem: row };
                    dispatch(selectSpinItem(tempData));
                    router.push(`/admin/spins/${row._id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <IoEye />
                </BsShieldCheck>
              )}
            </Tooltip>
          </Stack>
        )}
      </TableCell> */}
    </TableRow>
  );
}
TransectionRow.propTypes = {
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
    status: PropTypes.object.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
