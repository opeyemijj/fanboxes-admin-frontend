import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useSearchParams, usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

// mui
import {
  Divider,
  Card,
  Table,
  TableBody,
  TableContainer,
  Stack,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
  TextField
} from '@mui/material';

// components
import NotFound from 'src/illustrations/dataNotFound';
import Pagination from 'src/components/pagination';
import Search from 'src/components/search';
import TableHead from './tableHead';

CustomTable.propTypes = {
  headData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      alignRight: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,

  mobileRow: PropTypes.elementType,
  row: PropTypes.elementType.isRequired,
  filters: PropTypes.arr,
  isSearch: PropTypes.bool
};
export default function CustomTable({ filters = [], showRowCount = true, showPagination = true, ...props }) {
  const { headData, data, isLoading, heading, isSearch, row, ...rest } = props;
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState({});
  const queryString = searchParams.toString();
  const handleChange = (param, val) => {
    setState({ ...state, [param]: val });
    push(`${pathname}?` + createQueryString(param, val));
  };

  const updatedHeadData = [{ id: 'sn', label: 'S/N', alignRight: false }, ...headData];

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  // useEffect(() => {
  //   const params = new URLSearchParams('?' + queryString);
  //   const paramsObject = {};
  //   for (const [key, value] of params.entries()) {
  //     paramsObject[key] = value;
  //   }
  //   setState({ ...state, ...paramsObject });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    const params = new URLSearchParams('?' + queryString);
    const paramsObject = {};

    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }

    // ✅ Ensure every filter param exists in state (default to 'ALL' => '')
    filters.forEach((filter) => {
      if (!(filter.param in paramsObject)) {
        paramsObject[filter.param] = '';
      }
    });

    setState(paramsObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = row;
  return (
    <Card>
      <>
        {(filters.length > 0 || heading || isSearch) && (
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            {heading && (
              <Typography variant="h4" color="text.primary" px={2} py={2}>
                {heading}
              </Typography>
            )}
            {isSearch ? <Search /> : null}
            <Stack spacing={2} direction="row">
              {filters.map((item) => (
                <FormControl fullWidth key={item.param} sx={{ maxWidth: 240, minWidth: 160 }}>
                  <Autocomplete
                    id={`autocomplete-${item.param}`}
                    size="small"
                    fullWidth
                    freeSolo
                    disableClearable
                    value={(() => {
                      const matchedOption = item.data.find(
                        (v) => v.slug === state[item.param] || v.name === state[item.param]
                      );

                      if (matchedOption) {
                        return {
                          label: matchedOption.name || matchedOption.title,
                          value: matchedOption.slug || matchedOption.name
                        };
                      }

                      if (state[item.param]) {
                        return {
                          label: state[item.param], // fallback display
                          value: state[item.param]
                        };
                      }

                      return { label: 'ALL', value: '' };
                    })()}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        handleChange(item.param, newValue);
                      } else if (newValue && newValue.value !== undefined) {
                        handleChange(item.param, newValue.value);
                      } else {
                        handleChange(item.param, '');
                      }
                    }}
                    options={[
                      { label: 'ALL', value: '' },
                      ...item.data.map((v) => ({
                        label: v.name || v.title,
                        value: v.slug || v.name
                      }))
                    ]}
                    renderInput={(params) => <TextField {...params} label={item.name} variant="outlined" />}
                  />
                </FormControl>
              ))}
            </Stack>
          </Stack>
        )}

        {!isLoading && data?.data?.length === 0 ? (
          <>
            <Divider />

            <NotFound title="No Order Found" />
          </>
        ) : (
          <>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead headData={updatedHeadData} />
                <TableBody>
                  {(isLoading ? Array.from(new Array(6)) : data?.data)?.map((item, index) => {
                    const limit = Number(state.limit) || 10;
                    const serialNumber = (data?.currentPage ? data.currentPage - 1 : 0) * limit + index + 1;

                    return (
                      <Component key={Math.random()} sn={serialNumber} row={item} isLoading={isLoading} {...rest} />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />
            {!isLoading && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={2}
                spacing={2}
                mt={2}
                pr={2}
              >
                {showRowCount && (
                  <FormControl sx={{ minWidth: 120, marginLeft: 10 }} size="small">
                    <InputLabel id="rows-per-page-label">Show per page</InputLabel>
                    <Select
                      labelId="rows-per-page-label"
                      id="rows-per-page"
                      value={state.limit ?? 10}
                      label="Rows"
                      onChange={(e) => handleChange('limit', e.target.value)}
                    >
                      {[10, 20, 50, 100].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Pagination on the right */}
                {showPagination && <Pagination data={data} />}
              </Stack>
            )}
          </>
        )}
      </>
    </Card>
  );
}
