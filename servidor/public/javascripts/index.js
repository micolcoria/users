console.log('hola')

$.ajax(
    'http://localhost:3000/api/users'
).done(function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        $('#container').append(`
            <div id='user-${data[i]}' class='div-users'>
            <p>${data[i].name}</p>
            <p>${data[i].surname}</p>
            <p>${data[i].phone}</p>
            <p>${data[i].mail}</p>
            <button class="btn" id="put"><a href="/users/edit?id=${data[i].id}">Editar</a></button>
            <button onclick="borrar(${data[i].id})" class="btn" id="borrar">Borrar</button>
            </div>`)
    }
})


//para llegar a ese id lo habia puesto ya en el data id, el this hace referencia al boton que clickeaste, el this es el boton
//cuando a this le digo que me de a su parent
//el padre de ese boton es el div donde guardamos todas nuestros datos
//entonces ahi digo eliminar y bai

function borrar (id) {
    $.ajax('http://localhost:3000/api/users/' + id, {
        method: 'DELETE',
        success: function(){
            $('#container' + id).remove();
        }
    })
    location.href = '/users';
}


$('#filtrearbtn').click(function () {
    const searchWord = $('#barra').val();
    //despues del signo de pregunta es un query param
    //estoy sumando un parametro de busqueda, por eso creamos search
    //puede ser q de query
    $('.div-users').remove();
    $.ajax('http://localhost:3000/api/users?search=' + searchWord)
        .done(function (data) {
            console.log("filtro", data)
            for (var i = 0; i < data.length; i++){
                console.log('blabla')
                $('#container').append(`
                <div id='user-${data[i]}' class='div-users'>
                <p>${data[i].name}</p>
                <p>${data[i].surname}</p>
                <p>${data[i].phone}</p>
                <p>${data[i].mail}</p>
                <button class="btn" id="put"><a href="/users/edit?id=${data[i].id}">Editar</a></button>
                <button onclick="borrar(${data[i].id})" class="btn" id="borrar">Borrar</button>
                </div>`)
            }
        })
})


//Otra opcion para borrar

// $(document).on('click', '#borrar', function () {
//     const id = $(this).parent().data('id');
//     $.ajax(`/api/users/${id}`, {method: 'DELETE'});
//     $(this).parent().remove();
// })


//buscar la carpeta que me crea sweet alert para copiarla en la carpeta de javascripts, solamente el archivo que me pide