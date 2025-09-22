import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, useTheme } from '@mui/material';

// icons
import { MdCancel, MdCheckCircle, MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';
import { UsePermission } from 'src/hooks/usePermission';

Slide.propTypes = {
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

export default function Slide({ isLoading, row, handleClickOpen, sn, handleClickOpenStatus }) {
  const canEdit = UsePermission('edit_slide');
  const canDelete = UsePermission('delete_slide');
  const canApprove = UsePermission('approve_slide');
  const router = useRouter();
  const theme = useTheme();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>

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
              alt={row?.title}
              // blurDataURL={row?.shopDetails ? row?.shopDetails?.logo?.blurDataURL : ''}
              // placeholder={row?.shopDetails ? 'blur' : ''}
              src={row?.images[0]?.url}
              layout="fill"
              objectFit="cover"
            />
          </Box>
        )}

        <Typography variant="" noWrap>
          {isLoading ? <Skeleton variant="text" /> : row?.title}
        </Typography>
      </Box>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {row.buttonText} </>}</TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <div className="col">
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
          </div>
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
              {canApprove && (
                <Tooltip title={!row?.isActive ? 'Approve' : 'Draft'}>
                  <IconButton onClick={handleClickOpenStatus(row)}>
                    {!row?.isActive ? (
                      <MdCheckCircle style={{ width: 30 }} color="green" size={23} />
                    ) : (
                      <MdCancel style={{ width: 30 }} width={50} color="orange" size={23} />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {canEdit && (
                <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/admin/slides/${row?.slug}`)}>
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
