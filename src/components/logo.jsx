import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from 'next/image';


export const Logo = () => {
  const theme = useTheme();
  const { push } = useRouter();
  return (
    <Box
      sx={{
        cursor: 'pointer',
        width: { xs: 150, md: 250}
      }}
      onClick={() => push('/')}
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={50}
        style={{ height: 'auto', width: '100%' }}
      />


    </Box>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool
};
export default Logo;
