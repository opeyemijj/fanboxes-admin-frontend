import * as React from 'react';

// mui
import {
    Grid,
    Button,
    Stack,
    alpha,
    Skeleton,
    Typography,
    IconButton,
    DialogContent,
    Dialog
} from '@mui/material';

// icons
import { MdClear } from 'react-icons/md';
import { MdArrowDropDown } from 'react-icons/md';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

// Comprehensive currency to country code mapping
const currencyToCountryMap = {
    AED: 'AE',
    GBP: 'GB',
    USD: 'US',
    AUD: 'AU',
    EUR: 'DE',
    CAD: 'CA',
    JPY: 'JP',
    CHF: 'CH',
    CNY: 'CN',
    INR: 'IN',
    BRL: 'BR',
    RUB: 'RU',
    ZAR: 'ZA',
    NZD: 'NZ',
    SGD: 'SG',
    HKD: 'HK',
    KRW: 'KR',
    SEK: 'SE',
    NOK: 'NO',
    DKK: 'DK',
    PLN: 'PL',
    TRY: 'TR',
    MXN: 'MX',
    ARS: 'AR',
    CLP: 'CL',
    COP: 'CO',
    PEN: 'PE',
    VES: 'VE',
    EGP: 'EG',
    NGN: 'NG',
    KES: 'KE',
    GHS: 'GH',
    MAD: 'MA',
    TND: 'TN',
    SAR: 'SA',
    QAR: 'QA',
    KWD: 'KW',
    OMR: 'OM',
    BHD: 'BH',
    JOD: 'JO',
    LBP: 'LB',
    ILS: 'IL',
    THB: 'TH',
    MYR: 'MY',
    IDR: 'ID',
    VND: 'VN',
    PHP: 'PH',
    PKR: 'PK',
    BDT: 'BD',
    LKR: 'LK',
    NPR: 'NP',
    MMK: 'MM',
    KHR: 'KH',
    LAK: 'LA',
    MNT: 'MN',
    UZS: 'UZ',
    KZT: 'KZ',
    AZN: 'AZ',
    GEL: 'GE',
    AMD: 'AM',
    BYN: 'BY',
    UAH: 'UA',
    MDL: 'MD',
    RON: 'RO',
    BGN: 'BG',
    HRK: 'HR',
    CZK: 'CZ',
    HUF: 'HU',
    RSD: 'RS',
    BAM: 'BA',
    ALL: 'AL',
    MKD: 'MK',
    ISK: 'IS',
    FJD: 'FJ',
    PGK: 'PG',
    SBD: 'SB',
    TOP: 'TO',
    WST: 'WS',
    VUV: 'VU',
    XPF: 'PF'
};

export default function CurrencyConverter({ onCurrencyChange, initialCurrency = 'USD' }) {
    const [currency, setCurrency] = React.useState(initialCurrency);
    const [open, setOpen] = React.useState(false);
    const { data, isLoading } = useQuery(['get-currencies'], () => api.getCurrencies());

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getFlagEmoji = (countryCode) => {
        if (!countryCode) return '🏴';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    };

    const enhancedCurrencies = React.useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((cur) => ({
            ...cur,
            countryCode: currencyToCountryMap[cur.code] || '🏴'
        }));
    }, [data?.data]);

    const getFlagsByCurrency = (currencyCode) => {
        if (!enhancedCurrencies?.length) return '🏴';
        const cur = enhancedCurrencies.find((c) => c.code === currencyCode);
        return getFlagEmoji(cur?.countryCode);
    };

    const handleSelectCurrency = (cur) => {
        if (!cur) return;
        setCurrency(cur.code);
        if (onCurrencyChange) onCurrencyChange(cur);
        handleClose();
    };

    return (
        <div style={{ marginRight: '-20px' }}>
            <Button
                aria-label="lang-curr-select"
                onClick={handleClickOpen}
                variant="outlined"
                size="small"
                sx={{
                    marginLeft: -1,
                    textTransform: 'none',
                    padding: '4px 10px',
                    minWidth: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: '#ccc',
                    color: '#333'
                }}
            >
                {getFlagsByCurrency(currency)}
                <span className="d-none d-md-inline" style={{ fontSize: '14px' }}>
                    {currency}
                </span>
                <MdArrowDropDown />
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 5, top: 5, zIndex: 111 }}
                >
                    <MdClear />
                </IconButton>
                <DialogContent>
                    <Typography variant="h5" mb={2}>
                        Choose a currency
                    </Typography>
                    <Grid container justifyContent="center" spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 2 }}>
                        {(isLoading ? Array.from(new Array(12)) : enhancedCurrencies)?.map((cur) => (
                            <Grid key={cur?.code || Math.random()} item xs={12} sm={6} md={4}>
                                <Button
                                    onClick={() => handleSelectCurrency(cur)}
                                    fullWidth
                                    size="large"
                                    variant={currency === cur?.code ? 'outlined' : 'outlined'}
                                    color={currency === cur?.code ? 'primary' : 'inherit'}
                                    sx={{ textAlign: 'left', justifyContent: 'start' }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        {!isLoading && cur && (
                                            <Typography variant="h6" sx={{ minWidth: 30 }}>
                                                {getFlagEmoji(cur.countryCode)}
                                            </Typography>
                                        )}
                                        <Stack>
                                            <Typography variant="subtitle2" noWrap>
                                                {isLoading ? <Skeleton variant="text" width={120} /> : `${cur.name} (${cur.code})`}
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                {isLoading ? <Skeleton variant="text" width={60} /> : cur.country}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}
