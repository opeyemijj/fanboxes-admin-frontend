import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeCurrency } from 'src/redux/slices/settings';
import { useEffect, useRef } from 'react';

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
    Dialog,
    Topology
} from '@mui/material';

// icons
import { MdClear } from 'react-icons/md';
import { MdCurrencyExchange } from 'react-icons/md';
import { MdArrowDropDown } from 'react-icons/md';
import { FaExchangeAlt } from 'react-icons/fa';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import getLocation from 'src/utils/geolocation';

// Comprehensive currency to country code mapping
const currencyToCountryMap = {
    // Major currencies
    AED: 'AE', // UAE Dirham → United Arab Emirates
    GBP: 'GB', // British Pound Sterling → United Kingdom
    USD: 'US', // US Dollar → United States
    AUD: 'AU', // Australian Dollar → Australia
    EUR: 'DE', // Euro → Germany (primary Eurozone country)
    CAD: 'CA', // Canadian Dollar → Canada
    JPY: 'JP', // Japanese Yen → Japan
    CHF: 'CH', // Swiss Franc → Switzerland
    CNY: 'CN', // Chinese Yuan → China
    INR: 'IN', // Indian Rupee → India
    BRL: 'BR', // Brazilian Real → Brazil
    RUB: 'RU', // Russian Ruble → Russia
    ZAR: 'ZA', // South African Rand → South Africa
    NZD: 'NZ', // New Zealand Dollar → New Zealand
    SGD: 'SG', // Singapore Dollar → Singapore
    HKD: 'HK', // Hong Kong Dollar → Hong Kong
    KRW: 'KR', // South Korean Won → South Korea
    SEK: 'SE', // Swedish Krona → Sweden
    NOK: 'NO', // Norwegian Krone → Norway
    DKK: 'DK', // Danish Krone → Denmark
    PLN: 'PL', // Polish Złoty → Poland
    TRY: 'TR', // Turkish Lira → Turkey
    MXN: 'MX', // Mexican Peso → Mexico
    ARS: 'AR', // Argentine Peso → Argentina
    CLP: 'CL', // Chilean Peso → Chile
    COP: 'CO', // Colombian Peso → Colombia
    PEN: 'PE', // Peruvian Sol → Peru
    VES: 'VE', // Venezuelan Bolívar → Venezuela
    EGP: 'EG', // Egyptian Pound → Egypt
    NGN: 'NG', // Nigerian Naira → Nigeria
    KES: 'KE', // Kenyan Shilling → Kenya
    GHS: 'GH', // Ghanaian Cedi → Ghana
    MAD: 'MA', // Moroccan Dirham → Morocco
    TND: 'TN', // Tunisian Dinar → Tunisia
    SAR: 'SA', // Saudi Riyal → Saudi Arabia
    QAR: 'QA', // Qatari Riyal → Qatar
    KWD: 'KW', // Kuwaiti Dinar → Kuwait
    OMR: 'OM', // Omani Rial → Oman
    BHD: 'BH', // Bahraini Dinar → Bahrain
    JOD: 'JO', // Jordanian Dinar → Jordan
    LBP: 'LB', // Lebanese Pound → Lebanon
    ILS: 'IL', // Israeli New Shekel → Israel
    THB: 'TH', // Thai Baht → Thailand
    MYR: 'MY', // Malaysian Ringgit → Malaysia
    IDR: 'ID', // Indonesian Rupiah → Indonesia
    VND: 'VN', // Vietnamese Đồng → Vietnam
    PHP: 'PH', // Philippine Peso → Philippines
    PKR: 'PK', // Pakistani Rupee → Pakistan
    BDT: 'BD', // Bangladeshi Taka → Bangladesh
    LKR: 'LK', // Sri Lankan Rupee → Sri Lanka
    NPR: 'NP', // Nepalese Rupee → Nepal
    MMK: 'MM', // Burmese Kyat → Myanmar
    KHR: 'KH', // Cambodian Riel → Cambodia
    LAK: 'LA', // Lao Kip → Laos
    MNT: 'MN', // Mongolian Tögrög → Mongolia
    UZS: 'UZ', // Uzbekistani Som → Uzbekistan
    KZT: 'KZ', // Kazakhstani Tenge → Kazakhstan
    AZN: 'AZ', // Azerbaijani Manat → Azerbaijan
    GEL: 'GE', // Georgian Lari → Georgia
    AMD: 'AM', // Armenian Dram → Armenia
    BYN: 'BY', // Belarusian Ruble → Belarus
    UAH: 'UA', // Ukrainian Hryvnia → Ukraine
    MDL: 'MD', // Moldovan Leu → Moldova
    RON: 'RO', // Romanian Leu → Romania
    BGN: 'BG', // Bulgarian Lev → Bulgaria
    HRK: 'HR', // Croatian Kuna → Croatia
    CZK: 'CZ', // Czech Koruna → Czech Republic
    HUF: 'HU', // Hungarian Forint → Hungary
    RSD: 'RS', // Serbian Dinar → Serbia
    BAM: 'BA', // Bosnia-Herzegovina Convertible Mark → Bosnia and Herzegovina
    ALL: 'AL', // Albanian Lek → Albania
    MKD: 'MK', // Macedonian Denar → North Macedonia
    ISK: 'IS', // Icelandic Króna → Iceland
    FJD: 'FJ', // Fiji Dollar → Fiji
    PGK: 'PG', // Papua New Guinean Kina → Papua New Guinea
    SBD: 'SB', // Solomon Islands Dollar → Solomon Islands
    TOP: 'TO', // Tongan Paʻanga → Tonga
    WST: 'WS', // Samoan Tala → Samoa
    VUV: 'VU', // Vanuatu Vatu → Vanuatu
    XPF: 'PF' // CFP Franc → French Polynesia
};

export default function CurrencyConverter({ onCurrencyChange }) {
    const dispatch = useDispatch();
    const { currency } = useSelector(({ settings }) => settings);
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
        dispatch(
            handleChangeCurrency({
                currency: cur.code,
                rate: cur.rate,
                selectedCountry: cur.countryCode
            })
        );
        // Send selected currency out of component
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
                                    variant={'outlined'}
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