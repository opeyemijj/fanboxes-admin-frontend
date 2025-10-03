import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, useTheme } from '@mui/material';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';
import { UsePermission } from 'src/hooks/usePermission';

PaymentGateWay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  minWidth: 50,
  objectFit: 'cover',
  background: theme.palette.background.default,
  marginRight: theme.spacing(2),
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function PaymentGateWay({ isLoading, row, handleClickOpen, sn }) {
  const canEdit = UsePermission('edit_conversion');
  const canDelete = UsePermission('delete_conversion');
  const router = useRouter();
  const theme = useTheme();
  function getFirst20Chars(str) {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return `${str.slice(0, 20)}....`;
  }
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.name)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.paymentMethod)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : getFirst20Chars(row?.publicKey)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : getFirst20Chars(row?.secretKey)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : getFirst20Chars(row?.otherKeys[0]) || ''}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : getFirst20Chars(row?.otherKeys[1]) || ''}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              {canEdit && (
                <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/admin/payment-gateway/${row?.slug}`)}>
                    <MdEdit />
                  </IconButton>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleClickOpen(row.slug)}>
                    <MdDelete />
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
