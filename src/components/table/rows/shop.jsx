import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Link,
  Menu,
  MenuItem,
  ListItemText,
  Checkbox
} from '@mui/material';
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// icons
import { MdEdit, MdDelete, MdBlock, MdCheckCircle, MdCancel } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { GroupAdd, MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import { UsePermission } from 'src/hooks/usePermission';

export default function ProductRow({
  isLoading,
  row,
  handleClickOpen,
  handleClickOpenStatus,
  handleClickOpenBanned,
  openAssignUsers,
  sn,
  selectedRows,
  UpdateSelectedRow
}) {
  const router = useRouter();

  const canEdit = UsePermission('edit_influencer');
  const canDelete = UsePermission('delete_influencer');
  const canViewDetails = UsePermission('view_influencer_details');
  const canApprove = UsePermission('approve_influencer');
  const canBan = UsePermission('ban_unban_influencer');
  const canAssign = UsePermission('assign_influencer_to_user');

  function MoreActionsMenu({ row, handleClickOpenStatus, handleClickOpenBanned }) {
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
            <MenuItem onClick={handleClickOpenStatus(row, 'singleStatus')}>
              {!row.isActive ? <MdCheckCircle color="green" size={20} /> : <MdCancel color="orange" size={20} />}
              <ListItemText sx={{ ml: 1 }}>{row.isActive ? 'Draft' : 'Approve'}</ListItemText>
            </MenuItem>
          )}

          {canBan && (
            <MenuItem onClick={handleClickOpenBanned(row, 'singleBanned')}>
              <MdBlock size={20} color={!row.isBanned ? 'red' : ''} />
              <ListItemText sx={{ ml: 1 }}>{!row.isBanned ? 'Ban' : 'Unban'}</ListItemText>
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
      {/* ✅ Checkbox column */}
      <TableCell padding="checkbox">
        <Stack direction="row" alignItems="center" spacing={1}>
          {isLoading ? (
            <Skeleton variant="circular" width={20} height={20} />
          ) : (
            <>
              <Checkbox
                size="small"
                checked={selectedRows?.includes(row?._id)}
                onChange={() => UpdateSelectedRow(row?._id)}
              />
              {isLoading ? <Skeleton variant="text" width={20} /> : <Typography variant="body2">{sn}</Typography>}
            </>
          )}
        </Stack>
      </TableCell>

      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                img: { borderRadius: '2px' }
              }}
            >
              <BlurImage
                alt={row?.name}
                blurDataURL={row?.logo?.blurDataURL}
                placeholder="blur"
                src={row?.logo?.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.title}
          </Typography>
        </Box>
      </TableCell>

      <TableCell
        onClick={() => {
          if (row?.products?.length > 0) {
            router.push(`/admin/products?shop=${row?.slug}`);
          }
        }}
        sx={{
          cursor: 'pointer'
        }}
      >
        {isLoading ? <Skeleton variant="text" /> : <>{row.products?.length || 0}</>}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.visitedCount || 0}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.categoryDetails?.name || ''}</>}</TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <div className="col">
            {row?.isBanned ? (
              <Label
                sx={{ bgcolor: 'error.light', color: 'white', width: '70px', fontSize: '0.60rem', m: 0.2 }}
                variant="filled"
              >
                Banned
              </Label>
            ) : (
              <Label
                sx={{
                  width: '70px',
                  fontSize: '0.60rem',
                  m: 0.2,
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

      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            {/* View */}
            {canViewDetails && (
              <Link href={`/admin/shops/${row.slug}`}>
                <IconButton>
                  <IoEye />
                </IconButton>
              </Link>
            )}

            {/* Edit */}
            {canEdit && (
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/shops/edit/${row.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
            )}

            {/* Delete */}
            {canDelete && (
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row.slug)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            )}

            {/* More actions */}
            <MoreActionsMenu
              row={row}
              handleClickOpenStatus={handleClickOpenStatus}
              handleClickOpenBanned={handleClickOpenBanned}
            />
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}

ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    products: PropTypes.number,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    vendor: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    approved: PropTypes.bool.isRequired,
    approvedAt: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  handleClickOpenStatus: PropTypes.func.isRequired,
  handleClickOpenBanned: PropTypes.func.isRequired
};
