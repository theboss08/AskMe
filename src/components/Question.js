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
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import {Container, Card, CardContent, Backdrop, CircularProgress, TextField, Button, Divider, Collapse, CardActions} from '@material-ui/core';

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
  expandOpen: {
    transform: 'rotate(180deg)',
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
  const [user, setUser] = useState({});
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [expanded, setExpanded] = useState([]);
  const [comment, setComment] = useState([]);
  const [comments, setComments] = useState([]);
  const {question_id} = useParams();
  const history = useHistory();

  useEffect(() => {
    async function checkLogin() {
        let res = await axios.post('/user/check_login', {withCredentials: true});
        if(res.data.message === 'success') {
          setUser(res.data.body);
          setIsLoggedIn(true);
        }
    }
  	let fetchData = async () => {
      setBackdrop(true)
  		let res = await axios.get(`/question/${question_id}`);
  		if(res.data.message === 'success'){
  			setQuestion(res.data.question);
  		}
  		let res2 = await axios.get(`/answer/${question_id}`);
      let arr = new Array(res2.data.answers.length);
      arr.fill(false, 0, arr.length);
      setBackdrop(false)
      setExpanded(arr);
      setComment(new Array(arr.length).fill('', 0, arr.length));
      setComments(new Array(arr.length).fill([], 0, arr.length));
  		if(res2.data.message === 'success'){
  			setAnswers(res2.data.answers);
  		}
  	}
    let views = async () => {
      let res = await axios.put(`/question/views/${question_id}`);
    }
    checkLogin();
  	fetchData();
    views();
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
    let res = await axios.post('/answer', {withCredentials : true, body : answer, question_id});
    if(res.data.message === 'success') {
      alert('Answer added');
      history.go(0);
    }
  }

  const handleLogout = async e => {
    let res = await axios.post('/user/logout', {withCredentials : true});
    history.go(0);
  }

  const handleUpvote = async answer_id => {
    let res = await axios.post(`/answer/upvote/${answer_id}`, {withCredentials : true});
    if(res.data.message === 'success') {
      alert('Upvoted');
      history.go(0);
    }
  }

  const handleDownVote = async answer_id => {
    let res = await axios.post(`/answer/downvote/${answer_id}`, {withCredentials : true});
    if(res.data.message === 'success') {
      alert('Downvoted');
      history.go(0);
    }
  }

  const handleCommentChange = (e, key) => {
    setComment(comment.map((c, i) => {if(key === i) return e.target.value; else return c}))
  }

  const handleCommentSubmit = async (key, answer_id) => {
    let res = await axios.post('/answer_comment', {withCredentials : true, body : comment[key], answer_id});
    if(res.data.message === 'success'){
      alert('Comment Posted');
      history.go(0);
    }
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

  const likeButton = (answer, liked) => {
    if(isLoggedIn) {
      if(!liked) return <ThumbUpOutlinedIcon onClick={e => handleUpvote(answer._id)} fontSize={"large"} style={{marginTop : "20px", cursor : "pointer"}} />;
      else return <ThumbUpIcon onClick={e => handleDownVote(answer._id)} fontSize={"large"} style={{marginTop : "20px", cursor : "pointer"}} />;
    }
  }

  const handleExpand = (answer_id, key) => {
    setExpanded(expanded.map((value, i) => {
      if(i === key) {
        if(comments[key].length === 0) {
          axios.get(`/answer_comment/${answer_id}`).then((res) => {
            if(res.data.message === 'success'){
              setComments(comments.map((c, j) => {
                if(j === key) {
                  return res.data.comments;
                }
                else return c;
              }))
            }
          })
        }
        return !value;
    }
    else return value;}));
  }

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










    <Container style={{width : "60%", marginTop : "20px"}} >
	<h2 style={{marginBottom : "70px"}} >
		<Link to={`/question/${question._id}`} style={{color : "black", textDecoration : "none", fontWeight : "bold"}} >{question.body}</Link>
		<div style={{fontSize : "16px", marginTop : "10px", display : "flex", justifyContent : "space-between"}} ><span>Asked : {new Date(question.updatedAt).toDateString()}</span><span>Asked By : <Link to={`/profile/${question.user_id}`} style={{textDecoration : "none", color : "black", fontWeight : "bold"}} >{question.asked_by}</Link> </span></div>
	</h2>






    {/* Posting answer section */}

    {isLoggedIn && (    <div>
    <h2 style={{fontWeight : "bold"}} >
    Post Answer
    </h2>
    <form onSubmit={handleSubmit} autoComplete="off" >
    <div>
    <TextField
    onChange={e => setAnswer(e.target.value)}
    value={answer}
    fullWidth={true}
    id="filled-multiline-static"
    label="Your answer..."
    multiline
    rows={7}
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
    </div>)}





    {answers.map((answer, key) => <Card key={key} style={{marginBottom : "40px"}} >
      <CardContent>
        <Typography>
        {answer.body}
        </Typography>
        <Typography color="textSecondary" style={{marginTop : "20px"}} >
        By : <Link to={`/profile/${answer.user_id}`} style={{color : "black", textDecoration : "none", fontWeight : "bold"}}>{answer.answered_by}</Link> on {new Date(answer.updatedAt).toDateString()}
        </Typography>
        {likeButton(answer, answer.liked)}
        <Typography style={{marginTop : "10px", fontSize : "20px", fontWeight : 600}} >Votes : {answer.votes}</Typography>
        <CardActions disableSpacing>
        <IconButton
          onClick={e => handleExpand(answer._id, key)}
          aria-expanded={expanded}
          aria-label="show more"
          
        >
          Comments
          <ExpandMoreIcon className={clsx({
          [classes.expandOpen]: expanded[key],
          })} />
        </IconButton>
      </CardActions>
        <Collapse in={expanded[key]} timeout="auto" unmountOnExit>
        <CardContent>
          {isLoggedIn && (<form onSubmit={e => {e.preventDefault();handleCommentSubmit(key, answer._id)}} autoComplete="off">
    <div style={{marginBottom : "20px"}} ><TextField value={comment[key]} onChange={e => handleCommentChange(e, key)} required fullWidth={true} id="outlined-basic" label="Comment" variant="outlined" /></div>
    <div><Button type="submit" variant="contained" color="primary">Post</Button></div>
  </form>)}

  {comments[key].map((c, key) => <div key={key}><Typography style={{marginTop : "15px", marginBottom : "10px"}}> {c.body} </Typography><hr /></div>)}

 
        </CardContent>
      </Collapse>
      </CardContent>
    </Card>)}
    </Container>
    </>
  );
}
