import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
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
import {Container, Backdrop, CircularProgress, TextField, Button, Divider} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

export default function Home() {
  const classes = useStyles();

  const [questionList, setQuestionList] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [backdrop, setBackdrop] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const history = useHistory();

  useEffect(() => {
  	async function checkLogin() {
  		try {
  			let res = await axios.post('/user/check_login', {withCredentials: true});
  			if(res.data.message === 'success') {
  				setUser(res.data.body);
  				setIsLoggedIn(true);
  			}
  		} catch (err) {

  		}
  	}
  	async function fetchQuestions() {
  		try {
  			const res = await axios.get('/question');
        setBackdrop(false);
	  		if(res.data.message === 'success'){
	  			setQuestionList(res.data.questions);
	  		}
  		}
  		catch (err) {
  			console.log(err);
  		}
  	}
    async function fetchAllQuestions() {
      let res = await axios.get('/question/all_questions');
      if(res.data.message === 'success') {
        setQuestions(res.data.questions);
        console.log(res.data.questions);
      }
    }
  	checkLogin();
  	fetchQuestions();
    fetchAllQuestions();
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

  const handleSubmit = async e => {
    e.preventDefault();
    let res = await axios.post('/question', {withCredentials : true, body : question})
    alert('Question posted');
    setQuestion('');
  };

  const handleLogout = async e => {
    let res = await axios.post('/user/logout', {withCredentials : true});
    history.go(0);
  }

  const handleSearch = e => {
    setSearch(e.target.value);
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

  return (
    <>
    <Backdrop open={backdrop} style={{zIndex : 10000}} >
    <CircularProgress color="inherit" />
    </Backdrop>
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/" style={{textDecoration : "none", color : "white"}} >Askme</Link>
          </Typography>
          <div className={classes.search}>



      <Autocomplete
        value={search}
        onChange={(event, newValue) => {
          if(newValue) {
            history.push(`/question/${newValue._id}`);
          }
          else setSearch('');
        }}
        inputValue={searchInput}
        onInputChange={(event, newInputValue) => {
          setSearchInput(newInputValue);
        }}
        id="controllable-states-demo"
        options={questions}
        getOptionLabel={(option) => option.body}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
      />



          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          {isLoggedIn ? <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton> : <><MenuItem>
            <div> <Link style={{textDecoration : "none", color : "white"}} to="/login">Login</Link> </div>
            </MenuItem><MenuItem>
            <div> <Link style={{textDecoration : "none", color : "white"}} to="/register">Register</Link> </div>
            </MenuItem></>}
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
      {renderMenu}
      {renderMobileMenu}
    </div>












    {isLoggedIn && (    <Container style={{marginTop : "30px", width : "60%"}} >
    <h2 style={{fontWeight : "bold"}} >
    Ask Question
    </h2>
    <form onSubmit={handleSubmit} autoComplete="off" >
    <div>
    <TextField
    onChange={e => setQuestion(e.target.value)}
    value={question}
    fullWidth={true}
    id="filled-multiline-static"
    label="Your question..."
    multiline
    rows={4}
    variant="outlined"
    required={true}
    style={{marginTop : "20px"}}
    />
    </div>
    <div>
    <div style={{marginTop : "20px"}} ><Button type="submit" variant="contained" color="primary">Post</Button></div>
    </div>
    </form>
    <Divider style={{marginTop : "20px"}} />
    </Container>)}







    <Container style={{marginTop : "20px", width : "60%"}}>
    <h2 style={{fontWeight : 600, marginBottom : "20px"}} >Browse Questions</h2>
    {questionList.map((question, key) => 
    	<h2 key={key} style={{marginBottom : "30px"}} >
    		<Link to={`/question/${question._id}`} style={{color : "black", textDecoration : "none", fontWeight : "bold"}} >{question.body}</Link>
    		<div style={{fontSize : "16px", marginTop : "10px", display : "flex", justifyContent : "space-between"}} ><span>Asked : {new Date(question.updatedAt).toDateString()}</span><span>Asked By : <Link to={`/profile/${question.user_id}`} style={{textDecoration : "none", color : "black", fontWeight : "bold"}} >{question.asked_by}</Link> </span></div>
    	</h2>
    )}
    </Container>
    </>
  );
}
