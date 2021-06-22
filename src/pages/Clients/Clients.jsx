import React, { Fragment, useState, useEffect } from 'react';
import { Container, Paper, ThemeProvider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { pageStyles, locale } from '../../config/styles.jsx';

const axios = require('axios');
const moment = require('moment');

export default function Clients() {
  //Создаем константы для отслеживания изменений на странице
  const [clientsList, setClientsList] = useState([{}]);
  const [selectionModel, setSelectionModel] = useState([]);
  //Создание новой записи
  const saveClient = () => {
    axios.post('http://localhost:3005/clients', {
      status: "Новый",
    })
      .then(async (res) => {
        await getList();
      })
  }
  //Изменение записи
  const editClient = (props) => {
    axios.post('http://localhost:3005/clients/' + props.id, {
      field: props.field,
      value: props.props.value,
    })
      .then(async (res) => {
        await getList();
      })
  }
  //Удаление записи
  const removeClient = (props) => {
    axios.delete('http://localhost:3005/clients/' + props.toString())
      .then(async (res) => {
        await getList();
      })
      //Очищаем для сброса состояния чекбоксов
      setSelectionModel([]);
  }
  //Получение данных из БД
  const getList = () => {
    axios.get('http://localhost:3005/clients')
      .then((res) => {
        if (res) {
          setClientsList(res.data);
        }
      })
  }
  //Перечень колонок таблицы и их параметры
  const columns = [
    { field: 'id', headerName: '№', flex: 0.4, headerAlign: 'center' },
    { field: 'name', headerName: 'Имя', flex: 1, headerAlign: 'center', editable: true },
    { field: 'surname', headerName: 'Фамилия', flex: 1, headerAlign: 'center', editable: true },
    { field: 'midname', headerName: 'Отчество', flex: 1, headerAlign: 'center', editable: true },
    { field: 'birthdate', headerName: 'Дата рождения', flex: 1, headerAlign: 'center', editable: true, type: 'date' },
    { field: 'passport_series', headerName: 'Серия паспорта', flex: 1, headerAlign: 'center', align: 'center', editable: true },
    { field: 'passport_num', headerName: 'Номер паспорта', flex: 1, headerAlign: 'center', align: 'center', editable: true },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center', editable: true },
    { field: 'address', headerName: 'Адрес', flex: 1, headerAlign: 'center', editable: true },
  ];
  //Записываем полученные из БД данные в объект
  const rows = clientsList.map((item) => {
    return {
      id: item.id,
      name: item.name,
      surname: item.surname,
      midname: item.midname,
      birthdate: moment(item.birthdate).format('DD-MM-YYYY'),
      passport_series: item.passport_series,
      passport_num: item.passport_num,
      email: item.email,
      address: item.address,
    }
  });
  //Запрашиваем данные из БД
  useEffect(() => {
    getList();
  }, []);
  //Применяем CSS стили
  const classes = pageStyles();

  return (
    <Fragment>
      <div className={classes.appBarSpacer} />
      <Container maxWidth='xl' className={classes.container}>
        <Paper className={classes.paper}>
          <ThemeProvider theme={locale}>
            {/* Создаем таблицу */}
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
              onEditCellChangeCommitted={editClient}
            /> : <div />}
          </ThemeProvider>
          {/* Отрисовываем иконку добавления/удаления записи в зависимости от того, выбрана ли запись */}
          {selectionModel.length ?
            <IconButton size='small' onClick={() => { removeClient(selectionModel) }}>
              <DeleteIcon color='error' />
            </IconButton> :
            <IconButton size='small' onClick={saveClient}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
        </Paper>
      </Container>
    </Fragment>
  );
}