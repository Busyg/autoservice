import React, { Fragment, Component } from 'react';
import { Helmet } from 'react-helmet';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class Login extends Component {

  constructor(props) {
    super(props);

    this.axios = require('axios');

    this.state = {
      login: null,
      password: null,
      isAuthenticating: false,
      errorMessage: null,
    }
  }
  //Проверяем заполнены ли поля логин и пароль
  isNotEmptyFields = () => {
    return this.state.login && this.state.password ? true : false
  }
  //Логинимся
  login = () => {
    //Если поля не заполнены - не логинимся
    if (!this.isNotEmptyFields()) return;
    //Если заполнены - запускаем процесс логина и блокируем поля и кнопку "Войти"
    this.setState(prevState => {
      return Object.assign({}, prevState, {
        isAuthenticating: true,
      })
    }, () => {
      this.loginProcess();
    });
  }
  //Логинимся дальше
  loginProcess = () => {
    if (this.state.isAuthenticating) {

      // Задаем параметры
      const login = this.state.login;
      const password = this.state.password;

      // Конвертируем в base64
      const token = require('buffer/').Buffer.from(`${login}:${password}`, 'utf8').toString('base64');
      const url = 'http://localhost:3005/auth';
      //Отправляем данные на сервер
      this.axios.post(url, {}, {
        headers: {
          'auth': `Basic ${token}`
        }
      })
        .then((response) => {

          // Устанавливаем токен
          this.setState(prevState => {
            return Object.assign({}, prevState, {
              isAuthenticating: false
            });
          }, () => {

            if (response.data.id) {
              this.setState(prevState => {
                this.props.setAuth(response.data);
              });
            } else { // Если такого пользователя не существует
              this.setState(prevState => {
                return Object.assign({}, prevState, {
                  errorMessage: response.data.message
                });
              });
            }
          });
        })
        .catch(() => {
          this.setState(prevState => {
            return Object.assign({}, prevState, {
              isAuthenticating: false
            })
          });
        });
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target;

    this.setState(prevState => {
      return Object.assign({}, prevState, {
        [name]: value
      })
    })
  }
  //Отрисовываем страницу логина
  render() {
    return (
        <Fragment>
          <Helmet>
            <title>Войти</title>
          </Helmet>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{ marginTop: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h4">
                ООО ВТК
              </Typography>
              <Typography component="h1" variant="h6">
                Добро пожаловать
              </Typography>
              <form noValidate>
                <TextField
                  onChange={this.handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="login"
                  label="Логин"
                  name="login"
                  value={this.state.login || ""}
                  autoComplete="login"
                  autoFocus
                />
                <TextField
                  onChange={this.handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  value={this.state.password || ""}
                  autoComplete="current-password"
                />
                <Button
                  disabled={this.state.isAuthenticating ? true : false}
                  onClick={this.login}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Войти
                </Button>
              </form>
              {this.state.errorMessage ? <h3 style={{ color: 'red' }}>{this.state.errorMessage}</h3> : ""}
            </div>
          </Container>
        </Fragment>
    );
  }
}

export default Login;