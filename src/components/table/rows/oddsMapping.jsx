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

import { BsFillShieldFill, BsShieldCheck, BsPlayCircle, BsSendCheck, BsSignMergeRight } from 'react-icons/bs';
export default function OddsMappingRow({ isLoading, row, handleClickOpen, sn }) {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}
      >
        {isLoading ? <Skeleton variant="text" /> : <>{row?.item}</>}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{`${Number(row?.start)?.toFixed(6)}`}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{`${Number(row?.end)?.toFixed(6)}`}</>}</TableCell>
    </TableRow>
  );
}
OddsMappingRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.item,
    start: PropTypes.string.start,
    end: PropTypes.string.end
  }).isRequired
};
