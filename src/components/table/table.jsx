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
  TextField,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// components
import NotFound from 'src/illustrations/dataNotFound';
import Pagination from 'src/components/pagination';
import Search from 'src/components/search';
import TableHead from './tableHead';
import { GroupAdd } from '@mui/icons-material';

CustomTable.propTypes = {
  headData: PropTypes.array.isRequired,
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number,
    totalPages: PropTypes.number
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.elementType.isRequired,
  filters: PropTypes.array,
  isSearch: PropTypes.bool,
  bulkAction: PropTypes.array, // NEW
  selectedRows: PropTypes.array, // NEW
  UpdateSelectedRow: PropTypes.func // NEW
};

export default function CustomTable({
  filters = [],
  showRowCount = true,
  showPagination = true,
  bulkAction = [],
  selectedRows = [],
  UpdateSelectedRow,
  ...props
}) {
  const { headData, data, isLoading, heading, isSearch, row, ...rest } = props;
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState({});
  const queryString = searchParams.toString();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (actionObj) => {
    actionObj.action(selectedRows);
    handleCloseMenu();
  };

  const handleChange = (param, val) => {
    setState({ ...state, [param]: val });
    push(`${pathname}?` + createQueryString(param, val));
  };

  // 👇 Add checkbox column if bulkAction exists
  const updatedHeadData = [
    {
      id: 'sn',
      label: bulkAction.length > 0 ? 'S/N' : 'S/N',
      alignRight: false
    },
    ...headData
  ];

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams('?' + queryString);
    const paramsObject = {};
    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }
    filters.forEach((filter) => {
      if (!(filter.param in paramsObject)) {
        paramsObject[filter.param] = '';
      }
    });
    setState(paramsObject);
  }, []);

  const Component = row;

  return (
    <Card>
      {/* Filters / Heading / Search + Bulk Actions */}

      {(filters.length > 0 || heading || isSearch || (bulkAction.length > 0 && selectedRows.length > 0)) && (
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          {heading && (
            <Typography variant="h4" color="text.primary" px={2} py={2}>
              {heading}
            </Typography>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            {/* ✅ 3 dots menu if rows selected */}
            {bulkAction.length > 0 && selectedRows.length > 0 && (
              <>
                <IconButton onClick={handleOpenMenu} sx={{ border: '1px solid #ddd', borderRadius: 1, height: 55 }}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                >
                  {bulkAction.map((actionObj) => {
                    const isDelete = actionObj.actionName.toLowerCase() === 'delete';
                    return (
                      <MenuItem
                        key={actionObj.actionName}
                        onClick={() => handleActionClick(actionObj)}
                        sx={{
                          color: isDelete ? 'error.main' : 'inherit',
                          fontWeight: 500,
                          display: `${actionObj?.hasPermission ? 'block' : 'none'}`
                        }}
                      >
                        {actionObj.actionName}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </>
            )}

            {/* ✅ Search Field */}
            {isSearch ? <Search /> : null}
          </Stack>

          {/* ✅ Filters aligned right */}
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
                    const matchedOption = item.data?.find(
                      (v) => v.slug === state[item.param] || v.name === state[item.param]
                    );
                    if (matchedOption) {
                      return {
                        label: matchedOption.name || matchedOption.title,
                        value: matchedOption.slug || matchedOption.name
                      };
                    }
                    if (state[item.param]) {
                      return { label: state[item.param], value: state[item.param] };
                    }
                    return { label: 'All', value: '' };
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
                    ...item.data?.map((v) => ({ label: v.name || v.title, value: v.slug || v.name }))
                  ]}
                  renderInput={(params) => <TextField {...params} label={item.name} variant="outlined" />}
                />
              </FormControl>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Table / Data */}
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
                    <Component
                      key={Math.random()}
                      sn={serialNumber}
                      row={item}
                      isLoading={isLoading}
                      selectedRows={selectedRows} // pass down
                      UpdateSelectedRow={UpdateSelectedRow} // pass down
                      {...rest}
                    />
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
              {showPagination && <Pagination data={data} />}
            </Stack>
          )}
        </>
      )}
    </Card>
  );
}
