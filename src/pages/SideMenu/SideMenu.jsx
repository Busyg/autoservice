import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import StorageIcon from '@material-ui/icons/Storage';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { HashRouter, Link } from 'react-router-dom';
import { sideStyles } from '../../config/styles.jsx';

export default function SideMenuItems(props) {
  const classes = sideStyles();
  return (
    <div className="wrapper">
      <HashRouter>
          <Link className={classes.link} to="/">
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Главная страница" />
            </ListItem>
          </Link>
          <Link className={classes.link} to={{pathname: "/orders", state: "12345"}}>
            <ListItem button>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Заказы" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/clients">
            <ListItem button>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Клиенты" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/services">
            <ListItem button>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="Услуги" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/storage">
            <ListItem button>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Склад" />
            </ListItem>
          </Link>
          {console.log(props)}
          { props.auth.admin_flag == "Y" &&
          <Link className={classes.link} to="/users">
            <ListItem button>
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="Пользователи" />
            </ListItem>
          </Link>
          }
      </HashRouter>
    </div>
  );
}