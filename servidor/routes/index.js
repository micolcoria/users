var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
let users = fs.readFileSync('users.json');
users = JSON.parse(users);


//filtreo a ver si ese search tiene algo
// if (search && search.length > 0) {
//   users = todos.filtrer(function (todo) {
//     return todo.text.toLowerCase().indexOf(search.toLowerCase())
//   })
// }

/* GET home page. */

router.get('/ping', function(req, res, next) {
  res.send('pong');
});

//le esta diciendo que /users va a responder a index.html
router.get('/users', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'))
  // res.json(usuarios)
});

router.get('/users/new', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'new.html'))
})

router.get('/users/edit', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'put.html'))
})

//a partir de aca es todo de nuestra api
//todo lo que tenga /api/algo es que es desde nuestro servidor

//FILTRAR USUARIOS: 
router.get('/api/users', function (req, res) {
  const search = req.query.search;

  if (search && search.length) {
    let filtered = users.filter(u => {
      return u.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        u.surname.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        u.phone.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
        u.mail.toLowerCase().indexOf(search.toLowerCase()) >= 0
    });

    res.json(filtered);
    return;
  }
  res.json(users);
  return;
});

//creo una variable que es filtered y que el resultado de ese filtro lo guardo en esa variable y devuelvo esa variable con el resultado

router.get('/api/users/:id', function (req, res, next) {
  const id = req.params.id;
  console.log(id)

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      return res.json(users[i]);
    }
  }
});

//le estoy dando un punto de entrada para guardar los datos
//creamos el nuevo usuarios que viene del body, en req.body me llega todo lo que pusimos en el data del AJAX
//antes de hacer el push, validamos que la informacion este correcta (con un if, si la longitud del campo text es 0, esta mal)
//luego hacemos el push en el array para que se muestre
//lo mandamos como confirmacion de que todo salio ok

function mailValidation(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

router.post('/api/users', function (req, res, next) {
  let user = req.body

  if (users.length == 0) {
    user =  {
      id: 1,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      mail: user.mail
  }
  } else {
    const lastId = users[users.length - 1].id
    user.id = lastId + 1
  }

  // if (user.text.length === 0) {
  //   return res.status(400).end('');
  // }

  if (mailValidation(user.mail) === 0) {
    return res.status(400).end('');    
  }
  users.push(user)
  fs.writeFileSync('users.json', JSON.stringify(users))
  res.json(users)
})


//primero hay que buscar el usuario
//va a aparecer el req.body que es lo que habia puesto cuando agregue a ese usario
//abajo del for y el primer if queda
// todos[i].name = thingsToEdit.text;
// todos[i].surname = thingsToEdit.name;
// todos[i].phone = thingsToEdit.phone;
// todos[i].mail = thingsToEdit.mail;
//y despues hay que validarlo
//poner abajo pero dentro del put pero antes del for:
//if (thingsToEdit.text.length === 0) {
//  return res.status(400).end('');
//}
//despues al final podemos mandar un res.json(users) O un res.json('ok'); antes de terminar las ultimas dos llaves

router.put('/api/users/:id', function (req, res, next) {
  console.log(users)
  const id = req.params.id
  const thingsToEdit = req.body
  const bodyKeys = Object.keys(thingsToEdit)

  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i]
    if (currentUser.id == id) {
      const usersKeys = Object.keys(currentUser)
      console.log(usersKeys)
      console.log(bodyKeys)

      for (x = 0; x < bodyKeys.length; x++) {
        const currentBodyKey = bodyKeys[x]
        console.log(currentBodyKey)
        if (usersKeys.indexOf(currentBodyKey) > -1) {
          currentUser[currentBodyKey] = thingsToEdit[currentBodyKey]
        } else {
          console.log(`${currentBodyKey} no es una clave válida`)
        }
      }
      return res.json(currentUser)
    }
  }
  console.log(users)

})

//primero le decimos que necesitamos eliminar
//buscamos y pedimos el id con el req.params.id
//tenemos que recorrer los usuarios para ver que id tiene para borrarlo luego, por eso hacemos el for
//con el if le digo si ese usuario id coincide con el id a borrar
//usamos doble igual porque el id que me esta llegando es un string, es un texto, pero estoy guardando a los id con numero
//si quisiera hacer un triple igual deberia hacer un parseInt (req.params.id)
//lo borramos con splice, le pasamos la posicion de ese id en el array y luego le ponemos 1 porque vamos a borrar 1 solo

router.delete('/api/users/:id', function (req, res, next) {
  const id = req.params.id
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      users.splice(i, 1)
    }
  }
  res.send('ok');
  console.log(users)
})

//para crear users.json:

// let users = fs.readFileSync('users.json');
// users = JSON.parse(users);

// if (!users.find(u => u.name === newUser.name)) {
//   users.push(newUser);
// }

//Filtrar usuarios

// router.get('http://localhost:3000/api/users', function (req, res, next) {
  
//   console.log(usersJson)
//   res.json(usersJson);
// })



module.exports = router;
