'use client';
import React from 'react';
import PropTypes from 'prop-types';

//  mui
import { Typography, Skeleton, Divider, Table, TableBody, TableRow, TableCell } from '@mui/material';

// components
import OrderDetailsTable from '../orderDetail';

// custom hooks
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

// styled
import RootStyled from './styled';

TableCard.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array.isRequired,
    totalItems: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function TableCard({ ...props }) {
  const { data, isLoading } = props;

  console.log(data, 'Checking the data');
  const items = data?.items;
  const fCurrency = useCurrencyFormatter(data?.currency);
  const conversionRate = data?.conversionRate;
  return (
    <RootStyled>
      {/* {isLoading ? (
        <Skeleton variant="text" width={100} className="skeleton-h5" />
      ) : (
        <Typography variant="h5" p={2}>
          {data?.totalItems} {data?.totalItems > 1 ? 'Items' : 'Item'}
        </Typography>
      )} */}
      <OrderDetailsTable data={items} isLoading={isLoading} conversionRate={conversionRate} currency={data?.currency} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow className="body-row">
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Subtotal</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{data?.subTotal || 0}</strong>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Shipping Fee</strong>
              )}
            </TableCell>

            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{data?.shippingFee || 0}</strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Discount</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>-{data?.discountApplied?.amount || 0}</strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? <Skeleton variant="text" className="skeleton-text" width={100} /> : <strong>Total</strong>}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{data?.transaction?.amount}</strong>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </RootStyled>
  );
}
