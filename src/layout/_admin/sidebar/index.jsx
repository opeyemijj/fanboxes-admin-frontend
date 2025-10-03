import React from 'react';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

// mui
import {
  styled,
  useTheme,
  alpha,
  useMediaQuery,
  Fab,
  Box,
  ListItemText,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

// icons
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuLayoutDashboard, LuShield, LuShieldOff } from 'react-icons/lu';
import { FaRegBuilding, FaSlidersH } from 'react-icons/fa';
import { TbCategory2 } from 'react-icons/tb';
import { BsPinAngleFill, BsPlayCircle, BsPlayCircleFill, BsShop } from 'react-icons/bs';
import { BsCart3 } from 'react-icons/bs';
import { LuUsers } from 'react-icons/lu';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { IoLogoAmplify, IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiCoupon5Line } from 'react-icons/ri';
import { BsBuildings } from 'react-icons/bs';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCashCoin } from 'react-icons/bs';
import { LuBadgePercent } from 'react-icons/lu';

// components
import Scrollbar from 'src/components/Scrollbar';
import { Logs, User, User2Icon, UserCheck, UserRound } from 'lucide-react';
import {
  ContactPage,
  MonetizationOn,
  Payment,
  Person,
  ReceiptLong,
  Security,
  SnippetFolder,
  SyncAlt,
  Transcribe
} from '@mui/icons-material';
import { UsePermission } from 'src/hooks/usePermission';

// Dashboard Side NevLinks

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  borderRadius: 0,
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `0px`,
  borderRadius: 0,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 11,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function Sidebar({ handleDrawerClose, handleDrawerOpen, open }) {
  function CheckMulitplePermission(permissionArray) {
    let permission = false;
    if (!permissionArray || permissionArray.length == 0) return permission;
    for (let i = 0; i < permissionArray.length; i++) {
      if (UsePermission(permissionArray[i])) {
        permission = true;
      }
    }

    return permission;
  }
  const navlinks = [
    {
      id: 1,
      title: 'Dashboard',
      hasPermission: true,
      slug: 'dashboard',
      icon: <LuLayoutDashboard />
    },
    {
      id: 2,
      title: 'Categories',
      slug: 'categories',
      hasPermission: UsePermission('view_category_listing'),
      icon: <TbCategory2 />,
      isSearch: true
    },
    {
      id: 3,
      title: 'Sub Categories',
      slug: 'sub-categories',
      hasPermission: UsePermission('view_subcategory_listing'),
      icon: <TbCategory2 />,
      isSearch: true
    },

    {
      id: 4,
      title: 'Influencers',
      slug: 'shops',
      hasPermission: UsePermission('view_influencer_listing'),
      icon: <BsBuildings />,
      isSearch: true
    },
    {
      id: 5,
      title: 'Boxes',
      slug: 'products',
      hasPermission: UsePermission('view_box_listing'),
      icon: <BsShop />,
      isSearch: true
    },

    {
      id: 10,
      title: 'Orders',
      slug: 'orders',
      hasPermission: UsePermission('view_order_listing'),
      icon: <BsCart3 />,
      isSearch: true
    },

    {
      id: 8,
      title: 'Payouts',
      slug: 'payouts',
      hasPermission: UsePermission('view_payout_listing'),
      icon: <BsCashCoin />,
      isSearch: false
    },
    {
      id: 9,
      title: 'Brands',
      slug: 'brands',
      hasPermission: UsePermission('view_brand_listing'),
      icon: <FaRegBuilding />,
      isSearch: true
    },
    {
      id: 12,
      title: 'Currencies',
      slug: 'currencies',
      hasPermission: UsePermission('view_currency_listing'),
      icon: <AiOutlineDollarCircle />,
      isSearch: true
    },
    {
      id: 11,
      title: 'Coupon codes',
      slug: 'coupon-codes',
      hasPermission: UsePermission('view_copon_code_listing'),
      icon: <RiCoupon5Line />,
      isSearch: true
    },

    {
      id: 15,
      title: 'Logs',
      slug: 'logs',
      hasPermission: CheckMulitplePermission(['view_spin_listing', 'view_transections_listing']),
      // need_permission: true,
      // permission_slug: 'view_slide_listing',
      icon: <Logs />,
      isSearch: false,
      children: [
        {
          id: '15-1',
          title: 'Spins',
          slug: 'spins',
          hasPermission: UsePermission('view_spin_listing'),
          icon: <BsPlayCircle />,
          isSearch: true
        },
        {
          id: '15-2',
          title: 'Transactions',
          slug: 'transections',
          hasPermission: UsePermission('view_transections_listing'),
          icon: <SyncAlt size={18} />,
          isSearch: true
        }
      ]
    },

    {
      id: 7,
      title: 'User Management',
      slug: 'user-management',
      icon: <LuUsers />,
      need_permission: true,
      hasPermission: CheckMulitplePermission([
        'view_user_listing',
        'view_influencer_user_listing',
        'view_admin_listing',
        'view_role_listing'
      ]),
      isSearch: true,
      children: [
        {
          id: '7-1',
          title: 'Roles',
          slug: 'roles',
          hasPermission: UsePermission('view_role_listing'),
          icon: <LuShield size={18} />,
          isSearch: true
        },
        {
          id: '7-2',
          title: 'User',
          slug: 'users',
          hasPermission: UsePermission('view_user_listing'),
          icon: <User size={18} />
        },
        {
          id: '7-3',
          title: 'Admin',
          slug: 'admin-users',
          hasPermission: UsePermission('view_admin_listing'),
          icon: <Security size={18} />
        },
        {
          id: '7-4',
          title: 'Influencer',
          slug: 'influencer-users',
          hasPermission: UsePermission('view_influencer_user_listing'),
          icon: <BsBuildings size={18} />
        }
      ]
    },

    {
      id: 13,
      title: 'Settings',
      slug: 'settings',
      hasPermission: UsePermission('settings'),
      icon: <IoSettingsOutline />,
      isSearch: false
    },

    {
      id: 14,
      title: 'Configuration',
      slug: 'configuration',
      hasPermission: CheckMulitplePermission(['view_slide_listing', 'view_conversion_listing']),
      icon: <IoLogoAmplify />,
      isSearch: false,
      children: [
        {
          id: '14-1',
          title: 'Slides',
          slug: 'slides',
          hasPermission: UsePermission('view_slide_listing'),
          icon: <FaSlidersH />,
          isSearch: true
        },
        {
          id: '14-2',
          title: 'Credits & Conversion',
          slug: 'credits',
          hasPermission: UsePermission('view_conversion_listing'),
          icon: <MonetizationOn size={18} />,
          isSearch: true
        },
        {
          id: '14-3',
          title: 'Payment Gateway',
          slug: 'payment-gateway',
          hasPermission: true, // UsePermission('view_conversion_listing'),
          icon: <Payment size={18} />,
          isSearch: true
        },
        {
          id: '14-4',
          title: 'Static Page',
          slug: 'static-page',
          hasPermission: true, // UsePermission('view_conversion_listing'),
          icon: <ContactPage size={18} />,
          isSearch: true
        }
      ]
    }
  ];

  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState('');
  const [initial, setInitial] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [expandedParent, setExpandedParent] = React.useState('');

  React.useEffect(() => {
    setActive(pathname);
    setInitial(true);
  }, [pathname]);
  return (
    <div>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '&.MuiDrawer-root': {
            '.MuiPaper-root': {
              overflow: { xs: 'hidden', md: 'unset' },
              zIndex: 998 + '!important'
            }
          }
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            position: 'absolute',
            right: -15,
            top: 85,
            zIndex: 9999999,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Fab
            size="small"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: '1px solid' + theme.palette.divider,
              boxShadow: 'none',
              height: 25,
              minHeight: 25,
              width: 25,
              ':hover': {
                bgcolor: theme.palette.background.paper
              },
              svg: {
                color: theme.palette.text.primary
              }
            }}
          >
            {open ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </Fab>
        </Box>
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <List
            sx={{
              px: 1.5,
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              py: 2
            }}
          >
            {navlinks.map((item) => (
              <>
                <React.Fragment key={item.id}>
                  <ListItem
                    disablePadding
                    sx={{
                      display: `${item.hasPermission ? 'block' : 'none'}`,
                      borderRadius: '8px',
                      border: `1px solid transparent`,
                      ...(active === '/admin/' + item.slug &&
                        initial && {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                          border: (theme) => `1px solid ${theme.palette.primary.main}`,
                          color: theme.palette.primary.main,
                          '& .MuiTypography-root': {
                            fontWeight: 600
                          }
                        })
                    }}
                  >
                    <Tooltip title={open ? '' : item.title} placement="left" arrow leaveDelay={200}>
                      <ListItemButton
                        onClick={() => {
                          if (item.children) {
                            setExpandedParent(expandedParent === item.slug ? '' : item.slug);
                          } else {
                            setExpandedParent(''); // collapse User Management if another parent is clicked
                            setActive('/admin/' + item.slug);
                            router.push('/admin/' + item.slug);
                            isMobile && handleDrawerClose();
                          }
                        }}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                          borderRadius: '8px'
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            overflow: 'hidden',
                            height: open ? 'auto' : 0,
                            textTransform: 'capitalize'
                          }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>

                  {/* Render children if User Management is active */}
                  {item.children && expandedParent === item.slug && (
                    <List sx={{ pl: open ? 4 : 0 }}>
                      {item.children?.map((child) => (
                        <ListItem
                          style={{ display: `${child.hasPermission ? 'block' : 'none'}` }}
                          key={child.id}
                          disablePadding
                        >
                          <Tooltip title={!open ? child.title : ''} placement="left" arrow leaveDelay={200}>
                            <ListItemButton
                              onClick={() => {
                                setActive('/admin/' + child.slug);
                                router.push('/admin/' + child.slug);
                                isMobile && handleDrawerClose();
                              }}
                              sx={{
                                minHeight: 40,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: '8px',
                                ...(active === '/admin/' + child.slug && {
                                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                                  border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                  color: (theme) => theme.palette.primary.main,
                                  '& .MuiTypography-root': {
                                    fontWeight: 600
                                  }
                                })
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : 'auto',
                                  justifyContent: 'center'
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={child.title}
                                sx={{
                                  overflow: 'hidden',
                                  height: open ? 'auto' : 0,
                                  textTransform: 'capitalize'
                                }}
                              />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              </>
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
