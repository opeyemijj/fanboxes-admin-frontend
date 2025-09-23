import React, { useState } from 'react';
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
import { GroupAdd, MoreVert, TrackChangesTwoTone } from '@mui/icons-material';
import { capitalize } from 'lodash';
import { ShipIcon } from 'lucide-react';
import { UsePermission } from 'src/hooks/usePermission';
import { IoEye } from 'react-icons/io5';
import { Menu, MenuItem, ListItemText, Switch } from '@mui/material';

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

  const canAssign = UsePermission('assign_order_to_user');
  const canAddTrackingInfo = UsePermission('update_order_tracking');
  const canAddShippinInfo = UsePermission('update_order_shipping');

  function MoreActionsMenu({ row, handleClickOpenTraking, handleClickOpenShipping }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <IconButton onClick={handleClick}>
          <MoreVert />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {canAddTrackingInfo && (
            <MenuItem style={{ marginLeft: 3 }} onClick={() => handleClickOpenTraking(row)}>
              <TrackChangesTwoTone style={{ marginRight: 10, width: 30 }} size={25} />{' '}
              <ListItemText style={{ marginLeft: 12 }}>Trakcing Info</ListItemText>
            </MenuItem>
          )}

          {row?.trackingInfo && canAddShippinInfo && (
            <MenuItem style={{ marginLeft: 3 }} onClick={() => handleClickOpenShipping(row)}>
              <ShipIcon style={{ marginRight: 10, width: 30 }} size={25} />{' '}
              <ListItemText style={{ marginLeft: 12 }}>Shipping Info</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

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
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : capitalize(row?.transaction?.paymentMethod?.replace(/_/g, ' '))}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (row?.shippingInfo?.at(-1)?.status === 'delivered' && 'success') ||
              (row?.shippingInfo?.at(-1)?.status === 'ontheway' && 'warning') ||
              (row?.shippingInfo?.at(-1)?.status === 'pending' && 'info') ||
              'error'
            }
          >
            {row?.shippingInfo?.at(-1)?.status || 'pending'}
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
              <Tooltip title="Preview">
                <IconButton onClick={() => router.push(`/admin/orders/${row._id}`)}>
                  <IoEye />
                </IconButton>
              </Tooltip>

              {canAssign && (
                <Tooltip title="Assign To">
                  <IconButton style={{ padding: 10 }} onClick={() => openAssignUsers(row)}>
                    <GroupAdd fontSize="small" />{' '}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}

          {/* More actions */}
          {!isLoading && (
            <MoreActionsMenu
              row={row}
              handleClickOpenTraking={handleClickOpenTraking}
              handleClickOpenShipping={handleClickOpenShipping}
            />
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
