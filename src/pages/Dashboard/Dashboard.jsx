import React, { Fragment, useState, useEffect } from 'react';
import { Container, Paper, ThemeProvider, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { pageStyles, locale } from '../../config/styles.jsx';

export default function Dashboard() {
  const axios = require('axios');
  const moment = require('moment');
  //Применяем CSS стили
  const classes = pageStyles();
  const [ordersList, setOrdersList] = useState([{}]);
  //Перечень колонок для таблицы и их параметры
  const columns = [
    { field: 'id', headerName: '№', flex: 0.4, headerAlign: 'center' },
    { field: 'status', headerName: 'Статус', flex: 1, headerAlign: 'center' },
    { field: 'date', headerName: 'Дата создания', flex: 1, headerAlign: 'center' },
    { field: 'name', headerName: 'ФИО', flex: 1, headerAlign: 'center' },
    { field: 'payment_method', headerName: 'Метод оплаты', flex: 1, headerAlign: 'center' },
    { field: 'price', headerName: 'Стоимость', flex: 1, headerAlign: 'center', align: 'center' },
  ];
  //Записываем данные из БД в объект
  const rows = ordersList.map((item) => {
    return {
      id: item.id,
      status: item.status,
      date: moment(item.date).format('hh:mm:ss DD/MM/YYYY'),
      name: item.name,
      payment_method: item.payment_method,
      price: item.price,
    }
  });
  //Получение записей из БД
  const getList = () => {
    axios.get('http://localhost:3005/orders')
      .then((res) => {
        if (res) {
          setOrdersList(res.data);
        }
      })
  }
  //Запрашиваем данные из БД
  useEffect(() => {
    getList();
  }, []);

  return (
    <main className={classes.content}>
      <Fragment>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='xl' className={classes.container}>
          <Paper className={classes.dashboardPaper}>
            <Typography color="primary" align="center" variant="h5">Последние заказы</Typography>
            <ThemeProvider theme={locale}>
              {/* Создаем таблицу */}
              {rows[0]['id'] ? <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                disableColumnMenu
                sortModel={[
                  {
                    field: 'date',
                    sort: 'desc',
                  },
                ]}
                hideFooterRowCount
                disableSelectionOnClick
              /> : <div />}
            </ThemeProvider>
          </Paper>
        </Container>
      </Fragment>
    </main>
  );
}