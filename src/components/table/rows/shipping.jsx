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

Shipping.propTypes = {
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

export default function Shipping({ isLoading, row, handleClickOpen, sn }) {
  const canEdit = UsePermission('edit_category');
  const canDelete = UsePermission('delete_category');
  const router = useRouter();
  const theme = useTheme();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{capitalize(row.status)}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row.statusDate}</>}</TableCell>
      <TableCell sx={{ alignItems: 'center' }}>
        {isLoading ? <Skeleton variant="text" /> : <>{row.statusComment}</>}
      </TableCell>
    </TableRow>
  );
}
