const stripeI18n = {
  es: {
    errors: {
      incorrect_number: 'El número de tarjeta es incorrecto.',
      invalid_number: 'El número de tarjeta no es un número de tarjeta válido.',
      invalid_expiry_month: 'El mes de caducidad de la tarjeta no es válido.',
      invalid_expiry_year: 'El año de caducidad de la tarjeta no es válido.',
      invalid_cvc: 'El código de seguridad de la tarjeta no es válido.',
      expired_card: 'La tarjeta ha caducado.',
      incorrect_cvc: 'El código de seguridad de la tarjeta es incorrecto.',
      incorrect_zip: 'Falló la validación del código postal de la tarjeta.',
      card_declined: 'La tarjeta fué rechazada.',
      missing: 'El cliente al que se está cobrando no tiene tarjeta',
      processing_error: 'Ocurrió un error procesando la tarjeta.',
      rate_limit: 'Ocurrió un error debido a consultar la API demasiado rápido. Por favor, avísanos si recibes este error continuamente.',
    },
  },
}

export default stripeI18n
