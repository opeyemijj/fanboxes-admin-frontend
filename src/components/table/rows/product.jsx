import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { enUS } from 'date-fns/locale';

// mui
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Rating, Tooltip } from '@mui/material';

// redux
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// icons
import { MdEdit, MdBlock, MdCheckCircle, MdCancel } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

import { Assignment, GroupAdd, MoreVert } from '@mui/icons-material';

import Link from 'next/link';

import { Menu, MenuItem, ListItemText, Switch } from '@mui/material';
import { useState } from 'react';
import { UsePermission } from 'src/hooks/usePermission';

export default function ProductRow({
  isLoading,
  showAction = true,
  row,
  handleClickOpen,
  handleClickOpenStatus,
  handleClickOpenBanned,
  handleClickOddsVisibility,
  openAssignUsers,
  oddsVisibileLoading,
  isVendor,
  sn
}) {
  // console.log(row, 'Check the row?');
  const router = useRouter();

  const canEdit = UsePermission('edit_box');
  const canDelete = UsePermission('delete_box');
  const canBan = UsePermission('ban_unban_box');
  const canHidItemOdd = UsePermission('hide_unhide_item_odd');
  const canApprove = UsePermission('approve_box');
  const canAssign = UsePermission('assign_box_to_user');

  function MoreActionsMenu({
    row,
    handleClickOpenStatus,
    handleClickOddsVisibility,
    oddsVisibileLoading,
    handleClickOpenBanned
  }) {
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
          {!row?.isBanned && canApprove && (
            <MenuItem onClick={handleClickOpenStatus(row)}>
              {!row.isActive ? (
                <MdCheckCircle style={{ width: 30 }} color="green" size={23} />
              ) : (
                <MdCancel style={{ width: 30 }} width={50} color="orange" size={23} />
              )}
              <ListItemText style={{ marginLeft: 12 }}>{row.isActive ? 'Draft' : 'Approve'}</ListItemText>
            </MenuItem>
          )}

          {canHidItemOdd && (
            <MenuItem>
              <Switch
                style={{ marginRight: 10, width: 30 }}
                size="small"
                disabled={oddsVisibileLoading}
                onChange={handleClickOddsVisibility(row)}
                checked={row?.isItemOddsHidden}
              />
              <ListItemText style={{ marginLeft: 10 }}>
                {row?.isItemOddsHidden ? 'Show Odds' : 'Hide Odds'}
              </ListItemText>
            </MenuItem>
          )}

          {canBan && (
            <MenuItem style={{ marginLeft: 3 }} onClick={handleClickOpenBanned(row)}>
              <MdBlock style={{ marginRight: 10, width: 30 }} size={25} color={!row.isBanned ? 'red' : ''} />{' '}
              <ListItemText style={{ marginLeft: 12 }}>{!row.isBanned ? 'Ban' : 'Unban'}</ListItemText>
            </MenuItem>
          )}

          {canAssign && (
            <MenuItem style={{ marginLeft: 3 }} onClick={() => openAssignUsers(row)}>
              <GroupAdd style={{ marginRight: 10, width: 30 }} size={25} color="primary" />{' '}
              <ListItemText style={{ marginLeft: 0 }}>Assign To</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Link
          style={{ textDecoration: 'none', color: 'inherit' }}
          target="_blank"
          href={`${process.env.USER_FRONTEND_URL}/boxes/${row?.slug}`}
        >
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
                  alt={row?.name}
                  // placeholder="blur"
                  blurDataURL={row?.images[0]?.blurDataURL || ''}
                  src={row?.images[0]?.url || ''}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            )}
            <Typography variant="subtitle2" noWrap>
              {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
            </Typography>
          </Box>
        </Link>
      </TableCell>

      <TableCell
        onClick={() => {
          if (row?.shop) {
            router.push(`/admin/products?shop=${row?.shopDetails?.slug}`, undefined, { shallow: false });
            router.refresh(); // forces reload
          } else {
            router.push(`/admin/products?shop=admin-box`);
            router.refresh(); // forces reload
          }
        }}
        component="th"
        scope="row"
        sx={{ maxWidth: 300, cursor: 'pointer' }}
      >
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
                alt={row?.shopDetails ? row?.shopDetails?.title : ''}
                blurDataURL={row?.shopDetails ? row?.shopDetails?.logo?.blurDataURL : ''}
                // placeholder={row?.shopDetails ? 'blur' : ''}
                src={row?.shopDetails ? row?.shopDetails?.logo?.url : '/images/FanboxesLogo.png'}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="" noWrap>
            {isLoading ? <Skeleton variant="text" /> : row?.shopDetails ? row?.shopDetails?.title : 'Admin'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.ownerType ? row?.ownerType : 'Influencer'}</TableCell>
      <TableCell align="center">
        {isLoading ? <Skeleton variant="text" /> : row?.visitedCount ? row?.visitedCount : 0}
      </TableCell>
      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`products/box/${row?.slug}`} passHref>
            {row?.items?.length || 0} Item(s)
          </Link>
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row?.priceSale || row?.price)}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <div className="col">
            {row?.isBanned ? (
              <Label
                sx={{ bgcolor: 'error.light', color: 'white', width: '70px', fontSize: '0.60rem', margin: 0.2 }}
                variant="filled"
              >
                {row?.isBanned ? 'Banned' : ''}
              </Label>
            ) : (
              <Label
                sx={{
                  width: '70px',
                  fontSize: '0.60rem',
                  margin: 0.2,
                  bgcolor: row?.isActive ? 'success.light' : 'warning.light',
                  color: row?.isActive ? 'success.dark' : 'white',
                  textTransform: 'capitalize'
                }}
              >
                {row?.isActive ? 'Approved' : 'Draft'}
              </Label>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row?.createdAt, enUS)}</>}</TableCell>
      {showAction && (
        <TableCell align="right">
          {isLoading ? (
            <Stack direction="row" justifyContent="flex-end">
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </Stack>
          ) : (
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              {/* Edit */}
              {canEdit && showAction && (
                <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/products/${row.slug}`)}>
                    <MdEdit />
                  </IconButton>
                </Tooltip>
              )}

              {/* Delete */}
              {canDelete && showAction && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleClickOpen(row.slug)}>
                    <MdDelete />
                  </IconButton>
                </Tooltip>
              )}

              {/* More actions */}
              {showAction && (
                <MoreActionsMenu
                  row={row}
                  handleClickOpenStatus={handleClickOpenStatus}
                  handleClickOddsVisibility={handleClickOddsVisibility}
                  oddsVisibileLoading={oddsVisibileLoading}
                  handleClickOpenBanned={handleClickOpenBanned}
                />
              )}
            </Stack>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  sn: PropTypes.number, // you are rendering {sn}
  isVendor: PropTypes.bool,
  oddsVisibileLoading: PropTypes.bool,

  row: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,

    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string
    }).isRequired,

    shopDetails: PropTypes.shape({
      title: PropTypes.string,
      logo: PropTypes.shape({
        url: PropTypes.string,
        blurDataURL: PropTypes.string
      })
    }),

    ownerType: PropTypes.string,
    visitedCount: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.object),
    priceSale: PropTypes.number,
    price: PropTypes.number,
    isActive: PropTypes.bool,
    isBanned: PropTypes.bool,
    isItemOddsHidden: PropTypes.bool,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }).isRequired,

  handleClickOpen: PropTypes.func.isRequired,
  handleClickOpenStatus: PropTypes.func,
  handleClickOpenBanned: PropTypes.func,
  handleClickOddsVisibility: PropTypes.func,
  openAssignUsers: PropTypes.func
};
