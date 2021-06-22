import React, { Fragment, useState, useEffect } from 'react';
import { Container, Paper, ThemeProvider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { pageStyles, locale } from '../../config/styles.jsx';

const axios = require('axios');

export default function Users() {

  const [usersList, setUsersList] = useState([{}]);
  const [selectionModel, setSelectionModel] = useState([]);

  const saveUsers = () => {
    axios.post('http://localhost:3005/users', {
      //status: "Новый",
    })
      .then(async (res) => {
        await getList();
      })
  }

  const editUsers = (props) => {
    axios.post('http://localhost:3005/users/' + props.id, {
      field: props.field,
      value: props.props.value,
    })
      .then(async (res) => {
        await getList();
      })
  }

  const removeUsers = (props) => {
    axios.delete('http://localhost:3005/users/' + props.toString())
      .then(async (res) => {
        await getList();
      })
      //Очищаем для сброса состояния чекбоксов
      setSelectionModel([]);
  }


  const getList = () => {
    axios.get('http://localhost:3005/users')
      .then((res) => {
        if (res) {
          setUsersList(res.data);
        }
      })
  }

  const columns = [
    { field: 'id', headerName: '№', flex: 0.4, headerAlign: 'center' },
    { field: 'login', headerName: 'Логин', flex: 1, headerAlign: 'center', editable: true },
    { field: 'password', headerName: 'Пароль', flex: 1, headerAlign: 'center', editable: true },
    { field: 'name', headerName: 'Имя', flex: 1, headerAlign: 'center', editable: true },
    { field: 'surname', headerName: 'Фамилия', flex: 1, headerAlign: 'center', editable: true },
    { field: 'admin_flag', headerName: 'Админ', flex: 0.4, headerAlign: 'center', editable: true, elementType: 'Checkbox' },
  ];

  const rows = usersList.map((item) => {
    return {
      id: item.id,
      login: item.login,
      password: item.password,
      admin_flag: item.admin_flag,
      name: item.name,
      surname: item.surname,
    }
  });

  useEffect(() => {
    getList();
  }, []);

  const classes = pageStyles();

  return (
    <Fragment>
      <div className={classes.appBarSpacer} />
      <Container maxWidth='xl' className={classes.container}>
        <Paper className={classes.paper}>
          <ThemeProvider theme={locale}>
            {rows[0]['id'] ? <DataGrid
              rows={rows}
              columns={columns}
              autoPageSize pagination
              checkboxSelection
              disableColumnMenu
              disableDensitySelector={true}
              components={{
                Toolbar: GridToolbar,
              }}
              onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection.selectionModel);
              }}
              selectionModel={selectionModel}
              onEditCellChangeCommitted={editUsers}
            /> : <div />}
          </ThemeProvider>
          {selectionModel.length ?
            <IconButton size='small' onClick={() => { removeUsers(selectionModel) }}>
              <DeleteIcon color='error' />
            </IconButton> :
            <IconButton size='small' onClick={saveUsers}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
        </Paper>
      </Container>
    </Fragment>
  );
}