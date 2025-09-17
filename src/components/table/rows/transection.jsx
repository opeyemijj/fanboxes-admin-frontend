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

TransectionRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,

  row: PropTypes.shape({
    transactionType: PropTypes.string,
    userData: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string
    }),
    paymentMethod: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    referenceId: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string // API date
  })
};

export default function TransectionRow({ isLoading, row, handleClickOpen, sn }) {
  const canVerify = UsePermission('verify_spin');
  const dispatch = useDispatch();
  const router = useRouter();

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
    </TableRow>
  );
}
