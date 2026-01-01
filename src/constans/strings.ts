export const strings = {
  appName: 'Pacer Time',
  pages: {
    home: 'Inicio',
    signUp: 'Crear cuenta',
    signIn: 'Iniciar sesión',
    uploadRunners: 'Cargar competidores',
    menu: 'Menú',
    account: {
      title: 'Mi perfil',
      conf: 'Configuración',
      logOut: 'Cerrar sesión',
    },
  },
  auth: {
    signUp: {
      title: 'Crear cuenta',
      instructions: 'Ingresa tus datos para crear una cuenta',
      name: 'El nombre debe tener al menos 1 carácter',
      lastName: 'El apellido debe tener al menos 1 carácter',
      phoneNumber: 'El número de teléfono debe tener el formato 229-100-1234',
      email: 'Email inválido',
      password: 'Contraseña inválida',
      passwordDontMatch: 'Las contraseñas no coinciden',
      error: 'Ha ocurrido un error inesperado al crear la cuenta.',
      existingEmail: 'Ya existe una cuenta con este correo electrónico.',
      haveAnAccount: '¿Ya tienes cuenta?',
      loading: 'Creando cuenta...',
      success: '¡Cuenta creada exitosamente!',
    },
    signIn: {
      title: 'Iniciar sesión',
      loading: 'Iniciando sesión...',
      success: '¡Inicio de sesión exitoso!',
      error: 'Email o contraseña incorrectos',
      instructions: 'Ingresa tu email y contraseña para iniciar sesión'
    },
    fields: {
      name: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      phoneNumber: 'Número de teléfono',
      passwordRequirements: 'La contraseña debe tener al menos 8 caracteres.',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      checkFields: 'Por favor verifica los campos del formulario.',
    },
  }
}