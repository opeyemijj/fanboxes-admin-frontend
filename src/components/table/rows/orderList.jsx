import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip } from '@mui/material';

// components

import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
import { fDateShort } from 'src/utils/formatTime';

// utils

// icons
import { GroupAdd, TrackChangesTwoTone } from '@mui/icons-material';
import { capitalize } from 'lodash';
import { ShipIcon } from 'lucide-react';

OrderList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isVendor: PropTypes.bool,
  row: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        cover: PropTypes.string,
        imageUrl: PropTypes.string,
        cover: PropTypes.string
      })
    ).isRequired,
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.oneOf(['delivered', 'ontheway', 'pending']).isRequired,
    total: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired,
  isUser: PropTypes.bool.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

export default function OrderList({
  isLoading,
  row,
  sn,
  openAssignUsers,
  handleClickOpenTraking,
  handleClickOpenShipping
}) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.orderNo}</TableCell>

      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row?.items[0]?.name}
                src={row?.items[0]?.images[0]?.url}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
        </Box>
      </TableCell>

      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : `${row?.user?.firstName + ' ' + row?.user?.lastName}`}
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.transaction?.category)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.transaction?.amount}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.transaction?.paymentMethod}</TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (row?.status === 'delivered' && 'success') ||
              (row?.status === 'ontheway' && 'warning') ||
              (row?.status === 'pending' && 'info') ||
              'error'
            }
          >
            {row.status}
          </Label>
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : (
            <>
              <Tooltip title="Assign To">
                <IconButton style={{ padding: 10 }} onClick={() => openAssignUsers(row)}>
                  <GroupAdd fontSize="small" />{' '}
                </IconButton>
              </Tooltip>

              <Tooltip title="Tracking Info">
                <IconButton style={{ marginLeft: 0, padding: 0 }} onClick={() => handleClickOpenTraking(row)}>
                  <TrackChangesTwoTone fontSize="small" />{' '}
                </IconButton>
              </Tooltip>

              {row?.trackingInfo ? (
                <Tooltip title="Shipping Info">
                  <IconButton style={{ marginLeft: 0, padding: 10 }} onClick={() => handleClickOpenShipping(row)}>
                    <ShipIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton style={{ paddingLeft: 32 }} />
              )}

              {/* <Tooltip title="Preview">
                <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/orders/${row._id}`)}>
                  <IoEye />
                </IconButton>
              </Tooltip> */}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
