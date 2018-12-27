$('#new').on('click', function () {
    const nombre = $('#name').val();
    const apellido = $('#surname').val();
    const telef = $('#phone').val();
    const correo = $('#mail').val();
  
    var newUser = {
      name: nombre,
      surname: apellido,
      phone: telef,
      mail: correo
    }
  
    $.ajax('http://localhost:3000/api/users', {
      method: 'POST',
      data: newUser,
      success: function(){
          location.href = '/users'
      }
    })
  });