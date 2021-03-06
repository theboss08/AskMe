import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useHistory } from 'react-router-dom';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {Container, Card, CardContent, Backdrop, CircularProgress, TextField, Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Question() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const history = useHistory();
  const [backdrop, setBackdrop] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({name : '', email : '', password : '', about : '', qualification : ''});

  useEffect(() => {
    async function checkLogin() {
      try {
        let res = await axios.post('/user/check_login', {withCredentials: true});
        setBackdrop(false);
        if(res.data.message === 'success') {
        	history.push('/');
        }
      } catch (err) {

      }
    }
    checkLogin();
  }, [])

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleSubmit = async (e) => {
  	e.preventDefault();
  	let res = await axios.post('/user/register', userDetails);
  	if(res.data.message === 'success'){
  		alert('Registered Successfully');
  		history.push('/login');
  	}
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}><Link to="/dashboard" style={{color : "black", textDecoration : "none"}} >Dashboard</Link></MenuItem>
      <MenuItem onClick={handleMenuClose}> <Link to="/" style={{color : "black", textDecoration : "none"}} >Logout </Link> </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
          <Backdrop open={backdrop} style={{zIndex : 100000}} >
        <CircularProgress color="inherit" />
      </Backdrop>
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
          <Link to="/" style={{textDecoration : "none", color : "white"}} >Askme</Link>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          {isLoggedIn ? (            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>) : <>
            <MenuItem>
            <div> <Link style={{textDecoration : "none", color : "white"}} to="/login">Login</Link> </div>
            </MenuItem><MenuItem>
            <div> <Link style={{textDecoration : "none", color : "white"}} to="/register">Register</Link> </div>
            </MenuItem>
            </>}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>







	<Container  style={{width : "20%", marginTop : "20px"}} >
    <form onSubmit={handleSubmit} autoComplete="off">
    	<div style={{marginBottom : "20px"}} ><TextField value={userDetails.name} onChange={e => setUserDetails({...userDetails, name : e.target.value})} required fullWidth={true} id="outlined-basic" label="Name" variant="outlined" /></div>
		<div style={{marginBottom : "20px"}} ><TextField value={userDetails.email} onChange={e => setUserDetails({...userDetails, email : e.target.value})} required fullWidth={true} id="outlined-basic" label="Email" variant="outlined" /></div>
		<div style={{marginBottom : "20px"}}><TextField value={userDetails.password} onChange={e => setUserDetails({...userDetails, password : e.target.value})} type="password" required fullWidth={true} id="outlined-basic" label="Password" variant="outlined" /></div>
		<div style={{marginBottom : "20px"}} ><TextField value={userDetails.about} onChange={e => setUserDetails({...userDetails, about : e.target.value})} fullWidth={true} id="outlined-basic" label="About" variant="outlined" /></div>
		<div style={{marginBottom : "20px"}} ><TextField value={userDetails.qualification} onChange={e => setUserDetails({...userDetails, qualification : e.target.value})} fullWidth={true} id="outlined-basic" label="Qualification" variant="outlined" /></div>
		<div style={{display : "flex", justifyContent : "center"}} ><Button type="submit" variant="contained" color="primary">Register</Button></div>
	</form>
    </Container>

    </>
  );
}
