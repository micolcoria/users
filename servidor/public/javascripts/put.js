// leo todos los query params de la url
const urlParams = new URLSearchParams(window.location.search);
// leo el parametro que le estoy pasando
const usuarioAEditar = urlParams.get('id');
//le pego a mi api de usuarios y concateno la variable que tiene el id    
$.ajax('http://localhost:3000/api/users/' + usuarioAEditar)
    .done(function (data) {
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#phone').val(data.phone);
        $('#mail').val(data.mail);
    })

$('#put').on('click', function () {
    $.ajax('http://localhost:3000/api/users/' + usuarioAEditar, {
        method: "PUT",
        data: {
            name: $('#name').val(),
            surname: $('#surname').val(),
            phone: $('#phone').val(),
            mail: $('#mail').val()
        },
        success: function () {
            location.href = '/users'
        }

    })
})

