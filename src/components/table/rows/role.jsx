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

Role.propTypes = {
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
export default function Role({ isLoading, row, handleClickOpen, sn }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.role}</TableCell>

      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Permissions:
                </Typography>
                {row?.permissions?.map((perm, index) => (
                  <Typography key={index} variant="body2">
                    {capitalize(perm)}
                  </Typography>
                ))}
              </Box>
            }
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: 3,
                  borderRadius: 2
                }
              }
            }}
          >
            <Box
              sx={{
                cursor: 'pointer',
                marginLeft: 3,
                fontSize: 12
                // fontWeight: 500
                // color: 'primary.main'
              }}
            >
              {row?.permissions?.length}
            </Box>
          </Tooltip>
        )}
      </TableCell>

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
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/roles/${row?.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row.slug)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
