import React, { Fragment, useState } from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToApp from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import SideMenuItems from './pages/SideMenu/SideMenu.jsx';
import routes from "./config/routes.jsx";
import Login from './pages/Login/Login.jsx';
import { appStyles } from './config/styles.jsx';

function App () {
  //Cоздаем константы для отслеживания изменений на странице
  const [auth, setAuth] = useState();
  const removeAuth = () => {
    setAuth();
  }
  //Определяем положение левого меню
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  //Применяем CSS стили
  const classes = appStyles();
  //Если пользователь не залогинен - отрисовываем страницу логина
  if(!auth) {
    return <Login setAuth={setAuth} />
  }
  //Иначе отрисовываем рабочую область
  return (
    <HashRouter>
      <div className={classes.root}>
        <Fragment>
          <CssBaseline />
          <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                <Switch>
                  <Route exact path="/">
                    Главная страница
                  </Route>
                  <Route exact path="/orders">
                    Заказы
                  </Route>
                  <Route exact path="/clients">
                    Клиенты
                  </Route>
                  <Route exact path="/services">
                    Услуги
                  </Route>
                  <Route exact path="/storage">
                    Склад
                  </Route>
                  <Route exact path="/users">
                    Пользователи
                  </Route>
                </Switch>
              </Typography>
              <IconButton color="inherit" onClick={removeAuth}>
                <ExitToApp />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <SideMenuItems auth={auth} />
            </List>
            <Divider />
          </Drawer>
        </Fragment>
      <Fragment>
        <div className={classes.content}>
          {routes.map(({path, component, name}) => {
              return <Route exact path = {path} key = {name} component = {component} />;
          })}
        </div>
      </Fragment>
    </div>
    </HashRouter>

  );
}

export default App;