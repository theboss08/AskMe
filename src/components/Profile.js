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
import {Container, Card, CardContent, CardActions, Button, Backdrop, CircularProgress } from '@material-ui/core';

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
  const [backdrop, setBackdrop] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [follow, setFollow] = useState(false);
  const [user, setUser] = useState({});
  const {user_id} = useParams();
  const history = useHistory();

  useEffect(() => {
    async function checkLogin() {
      try {
        let res = await axios.post('/user/check_login', {withCredentials: true});
        if(res.data.message === 'success') {
          setIsLoggedIn(true);
        }
      } catch (err) {

      }
    }

    let checkFollow = async () => {
      let res = await axios.post('/connection/check', {withCredentials : true, follows : user_id});
      if(res.data.message === 'success' && res.data.body === 'true'){
        setFollow(true);
      }
    }

  	let fetchData = async () => {
  		let res = await axios.get(`/user/${user_id}`);
      setBackdrop(false);
  		if(res.data.message === 'success') {
  			setUser(res.data.user);
  		}
  	}
    checkLogin();
    checkFollow();
  	fetchData();
  }, [])

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleFollow = async e => {
    e.preventDefault();
    let res = await axios.post('/connection/follow', {withCredentials : true, follows : user_id});
    if(res.data.message === 'success'){
      history.go(0);
    }
  }

  const handleUnFollow = async e => {
    e.preventDefault();
    let res = await axios.post('/connection/unfollow', {withCredentials : true, follows : user_id});
    if(res.data.message === 'success'){
      history.go(0);
    }
  }

  const handleLogout = async e => {
    let res = await axios.post('/user/logout', {withCredentials : true});
    history.go(0);
  }

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
      <MenuItem onClick={handleLogout}> Logout </MenuItem>
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

  const followButton = () => {
    if(isLoggedIn){
      if(follow) {
        return <form onSubmit={handleUnFollow} ><Button type="submit" variant="contained" color="primary" >UnFollow</Button></form>;
      }
      else return <form onSubmit={handleFollow} ><Button type="submit" variant="contained" color="primary" >Follow</Button></form>;
    }
  }

  return (
    <>
      <Backdrop open={backdrop} style={{zIndex : 100000}} >
        <CircularProgress color="inherit" />
      </Backdrop>
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
        <Link to="/" style={{textDecoration : "none", color : "white"}} ><Typography className={classes.title} variant="h6" noWrap>
            Askme
          </Typography></Link>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {isLoggedIn ? (<IconButton
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










    <Container fixed style={{width : "60%", marginTop : "20px"}} >
        <Card>
	      <CardContent>
	        <Typography variant="h5" component="h2" style={{marginBottom : "10px"}} >
	        {user.name}
	        </Typography>
	        <Typography color="textSecondary"  >
	        Email : {user.email}
        	</Typography>
        	<Typography color="textSecondary"  >
	        About : {user.about}
        	</Typography>
        	<Typography color="textSecondary"  >
	        Education : {user.qualification}
        	</Typography>
        	<Typography color="textSecondary" style={{fontWeight : "bold"}} >
	        Followers : {user.followers}
        	</Typography>
        	<CardActions style={{marginTop : "10px"}} >
          {followButton()}
        	</CardActions>
	      </CardContent>
	    </Card>
    </Container>
    </>
  );
}
