import React, { Fragment, useState, useEffect } from 'react';
import { Container, Paper, ThemeProvider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { pageStyles, locale } from '../../config/styles.jsx';

const axios = require('axios');

export default function Services() {

  const [servicesList, setServicesList] = useState([{}]);
  const [selectionModel, setSelectionModel] = useState([]);

  const saveService = () => {
    axios.post('http://localhost:3005/services', {
      status: "Новый",
    })
      .then(async (res) => {
        await getList();
      })
  }

  const editService = (props) => {
    axios.post('http://localhost:3005/services/' + props.id, {
      field: props.field,
      value: props.props.value,
    })
      .then(async (res) => {
        await getList();
      })
  }

  const removeService = (props) => {
    axios.delete('http://localhost:3005/services/' + props.toString())
      .then(async (res) => {
        await getList();
      })
      //Очищаем для сброса состояния чекбоксов
      setSelectionModel([]);
  }


  const getList = () => {
    axios.get('http://localhost:3005/services')
      .then((res) => {
        if (res) {
          setServicesList(res.data);
        }
      })
  }

  const columns = [
    { field: 'id', headerName: '№', flex: 0.4, headerAlign: 'center' },
    { field: 'name', headerName: 'Наименование', flex: 1, headerAlign: 'center', editable: true },
    { field: 'car_brand', headerName: 'Марка автомобиля', flex: 1, headerAlign: 'center', editable: true },
    { field: 'car_model', headerName: 'Модель автомобиля', flex: 1, headerAlign: 'center', editable: true },
    { field: 'price', headerName: 'Стоимость', flex: 1, headerAlign: 'center', editable: true, type: 'number' },
  ];

  const rows = servicesList.map((item) => {
    return {
      id: item.id,
      name: item.name,
      car_model: item.car_model,
      car_brand: item.car_brand,
      price: item.price,
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
              onEditCellChangeCommitted={editService}
            /> : <div />}
          </ThemeProvider>
          {selectionModel.length ?
            <IconButton size='small' onClick={() => { removeService(selectionModel) }}>
              <DeleteIcon color='error' />
            </IconButton> :
            <IconButton size='small' onClick={saveService}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
        </Paper>
      </Container>
    </Fragment>
  );
}