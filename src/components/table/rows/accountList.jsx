import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, Checkbox } from '@mui/material';

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

AccountList.propTypes = {
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

export default function AccountList({ isLoading, row, sn, selectedRows, UpdateSelectedRow }) {
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
          {canAddTrackingInfo && handleClickOpenTraking && (
            <MenuItem style={{ marginLeft: 3 }} onClick={() => handleClickOpenTraking(row)}>
              <TrackChangesTwoTone style={{ marginRight: 10, width: 30 }} size={25} />{' '}
              <ListItemText style={{ marginLeft: 12 }}>Tracking Info</ListItemText>
            </MenuItem>
          )}

          {row?.trackingInfo && canAddShippinInfo && handleClickOpenShipping && (
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

      {/* <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell> */}

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
              <BlurImage priority fill alt={row?.box_details?.name} src={row?.box_details?.image} objectFit="cover" />
            </ThumbImgStyle>
          )}

          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.box_details?.name}
          </Typography>
        </Box>
      </TableCell>

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
              <BlurImage priority fill alt={row?.item_details?.name} src={row?.item_details?.image} objectFit="cover" />
            </ThumbImgStyle>
          )}

          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.item_details?.name}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.item_price}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.amount}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.influencer_amount}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.fanboxes_amount}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.margin}</TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.transaction_type)}</TableCell>

      {/* <TableCell align="right">
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

              {canAssign && openAssignUsers && (
                <Tooltip title="Assign To">
                  <IconButton style={{ padding: 10 }} onClick={() => openAssignUsers(row)}>
                    <GroupAdd fontSize="small" />{' '}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}

          {!isLoading && (
            <MoreActionsMenu
              row={row}
              handleClickOpenTraking={handleClickOpenTraking}
              handleClickOpenShipping={handleClickOpenShipping}
            />
          )}
        </Stack>
      </TableCell> */}
    </TableRow>
  );
}
