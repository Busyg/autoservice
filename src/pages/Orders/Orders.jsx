import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Input, Paper, ThemeProvider, Tooltip, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { pageStyles, locale } from '../../config/styles.jsx';


const axios = require('axios');
const moment = require('moment');
const fileDownload = require('js-file-download');

export default function Orders(props) {
  //Создаем константы для отслеживания изменений на странице
  const [ordersList, setOrdersList] = useState([{}]);
  const [servicesList, setServicesList] = useState([{}]);
  const [clientsList, setClientsList] = useState([{}]);
  const [selectionModel, setSelectionModel] = useState([]);
  //Статусная модель
  const stateModel = [
    { status: 'Новый' },
    { status: 'Готов' },
    { status: 'В работе' },
    { status: 'Ожидание запчасти' },
    { status: 'Закрыт' },
  ]
  //Создание новой записи
  const saveOrder = () => {
    axios.post('http://localhost:3005/orders', {
      fieldNames: 'status, created_by',
      fieldValues: `'Новый' , ${'1'}`,

    })
      .then(async (res) => {
        await getList();
      })
  }
  //Изменение записи
  const editOrder = (props) => {
    console.log(props.props.value)
    axios.post('http://localhost:3005/orders/' + props.id, {
      field: props.field,
      value: props.props.value,
    })
      .then(async (res) => {
        await getList();
      })
  }
  //Удаление записи
  const removeOrder = (props) => {
    axios.delete('http://localhost:3005/orders/' + props.toString())
      .then(async (res) => {
        await getList();
      })
    //Очищаем для сброса состояния чекбоксов
    setSelectionModel([]);
  }
  //Получение записей из БД
  const getList = () => {
    axios.get('http://localhost:3005/orders')
      .then((res) => {
        if (res) {
          setOrdersList(res.data);
        }
      })
  }
  //Запрашиваем список услуг
  const getServicesList = () => {
    axios.get('http://localhost:3005/services')
      .then((res) => {
        if (res) {
          setServicesList(res.data);
        }
      })
  }
  //Запрашиваем список клиентов
  const getClientsList = () => {
    axios.get('http://localhost:3005/clients')
      .then((res) => {
        if (res) {
          setClientsList(res.data);
        }
      })
  }
  //Настройка отображения поля "Статус"
  const renderStatus = (params) => {
    const { id, api, field } = params;
    const handleChange = (event) => {
      editOrder({ id, field, props: { value: event.target.innerText } })
      api.commitCellChange({ id, field, params: event.target.innerText });
      api.setCellMode(id, field, 'view');
    };

    return <Autocomplete
      options={stateModel}
      getOptionLabel={(option) => option.status}
      style={{ display: 'flex' }}
      fullWidth={true}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    />;
  }
  //Настройка отображения поля "Услуги"
  const renderServices = (params) => {
    const { id, api, field } = params;
    const handleChange = (event) => {
      editOrder({ id, field, props: { value: event.target.innerText } })
      api.commitCellChange({ id, field, params: event.target.innerText });
      api.setCellMode(id, field, 'view');
    };
    console.log(stateModel)
    console.log(servicesRows)
    return <Autocomplete
      options={servicesRows}
      getOptionLabel={(option) => option.name}
      style={{ display: 'flex' }}
      fullWidth={true}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    />;
  }
  //Настройка отображения поля "Клиент"
  const renderClients = (params) => {
    const { id, api, field } = params;
    const handleChange = (event) => {
      editOrder({ id, field, props: { value: event.target.innerText } })
      api.commitCellChange({ id, field, params: event.target.innerText });
      api.setCellMode(id, field, 'view');
    };
    return <Autocomplete
      options={clientsRows}
      getOptionLabel={(option) => option.name}
      style={{ display: 'flex' }}
      fullWidth={true}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    />;
  }
  //Настройка отображения поля "Договор"
  const renderAgreement = (props) => {
    return (
      <div>
        <strong>
          {props.value ?
            <Tooltip title="Скачать" arrow>
              <IconButton component="label" variant="contained" size="small" onClick={() => { downloadAgreement(props.row) }}>
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip> : null}
          <Tooltip title="Загрузить" arrow>
            <IconButton component="label" variant="contained" size="small">
              <BackupIcon />
              <form encType="multipart/form-data">
                <input id={props.id} type="file" hidden onChange={uploadAgreement} />
              </form>
            </IconButton>
          </Tooltip>
        </strong>
      </div>
    )
  }

  //Скачиваем файлы с сервера
  const downloadAgreement = (props) => {
    //URL для обращения к серверу
    const url = 'http://localhost:3005/download';
    //Путь по которому лежит нужный файл
    const path = props.agreement_path;
    //Делаем запрос на сервер с вышеуказанными параметрами и сохраняем файл
    axios({ url, method: 'GET', responseType: 'blob', params: { path: path } })
      .then((res) => { fileDownload(res.data, path) }).catch((err) => alert(err));
  }

  //Загружаем файлы на сервер
  const uploadAgreement = (props) => {
    //Создаем объект для передачи на сервер
    var formData = new FormData();
    //Даем ему имя
    formData.append("name", `${props.target.id}`);
    //Прикрепляем файл
    formData.append("ageementFile", props.target.files[0]);
    //Делаем запрос на сервер с вышеуказанными параметрами и загружаем файл
    axios
      .post('http://localhost:3005/upload/orders', formData)
      .then(async (res) => {
        //Сохраняем путь к файлу в БД
        let editData = { id: res.data.id, field: 'agreement_path', props: { value: res.data.path } }
        editOrder(editData);
      })
      .catch((err) => alert(err));
  };
  //Список полей таблицы и их параметры
  const columns = [
    { field: 'id', headerName: '№', flex: 0.4, headerAlign: 'center' },
    { field: 'order_car', headerName: 'Автомобиль', flex: 1, headerAlign: 'center', editable: true },
    { field: 'order_services', headerName: 'Услуги', flex: 1, headerAlign: 'center', editable: true, renderEditCell: renderServices },
    { field: 'order_client', headerName: 'Клиент', flex: 1, headerAlign: 'center', editable: true, renderEditCell: renderClients },
    { field: 'status', headerName: 'Статус', flex: 1, headerAlign: 'center', editable: true, renderEditCell: renderStatus },
    { field: 'date', headerName: 'Дата создания', flex: 1, headerAlign: 'center' },
    { field: 'name', headerName: 'ФИО', flex: 1, headerAlign: 'center', editable: true },
    { field: 'payment_method', headerName: 'Метод оплаты', flex: 1, headerAlign: 'center', editable: true },
    { field: 'price', headerName: 'Стоимость', flex: 1, headerAlign: 'center', align: 'center', editable: true, type: 'number' },
    { field: 'created_by_name', headerName: 'Создал', flex: 1, headerAlign: 'center' },
    { field: 'agreement_path', headerName: 'Договор', flex: 1, headerAlign: 'center', align: 'center',editable: false, renderCell: renderAgreement },
  ];
  //Записываем данные из таблицы  в объект
  const rows = ordersList.map((item) => {
    return {
      id: item.id,
      status: item.status,
      date: moment(item.date).format('hh:mm:ss DD/MM/YYYY'),
      name: item.name,
      payment_method: item.payment_method,
      price: item.price,
      created_by_name: item.created_by_name + " " + item.created_by_surname,
      agreement_path: item.agreement_path,
      order_services: item.order_services,
      order_client: item.order_client,
      order_car: item.order_car,
    }
  });

  const servicesRows = servicesList.map((item) => {
    return {
      name: item.name
    }
  });

  const clientsRows = clientsList.map((item) => {
    return {
      id: item.id,
      name: item.surname + " " + item.name + " " + item.midname,
    }
  });

  useEffect(() => {
    getList();
    getServicesList();
    getClientsList();
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
              onEditCellChangeCommitted={editOrder}
            /> : <div />}
          </ThemeProvider>
          {selectionModel.length ?
            <IconButton size='small' onClick={() => { removeOrder(selectionModel) }}>
              <DeleteIcon color='error' />
              <h5 style={{ color: "red" }}>Удалить</h5>
            </IconButton> :
            <IconButton size='small' onClick={saveOrder} >
              <AddCircleOutlineIcon style={{ color: "green" }} />
              <h5 style={{ color: "green" }}>Добавить</h5>
            </IconButton>
          }
        </Paper>
      </Container>
    </Fragment>
  );
}