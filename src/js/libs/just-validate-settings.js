/* Just validate settings */
export function initJustValidate() {
  if (typeof JustValidate === 'undefined') return;

  const forms = document.querySelectorAll('.form');

  forms.forEach((form) => {
    const validator = new JustValidate(form, {
      errorLabelStyle: {
        // Remove default styling
        color: false,
      },
      errorFieldCssClass: 'error-field',
      errorLabelCssClass: 'error-label',
    });

    const textFields = form.querySelectorAll('.input-text[required]');

    textFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        {
          rule: 'minLength',
          errorMessage: 'Минимум 2 символа',
          value: 2,
        },
        {
          rule: 'maxLength',
          errorMessage: 'Максимум 30 символов',
          value: 30,
        },
      ]);
    });

    const textareaFields = form.querySelectorAll('.input-textarea[required]');

    textareaFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        {
          rule: 'minLength',
          errorMessage: 'Минимум 2 символа',
          value: 2,
        },
        {
          rule: 'maxLength',
          errorMessage: 'Максимум 2000 символов',
          value: 2000,
        },
      ]);
    });

    const emailFields = form.querySelectorAll('.input-email');

    emailFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'email',
          errorMessage: 'Некорректный формат e-mail',
        },
      ]);
    });

    const phoneFields = form.querySelectorAll('.input-tel');

    phoneFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'customRegexp',
          errorMessage: 'Некорректный формат номера',
          // Russian phone number formats + simple 7 digit format
          value: /^(?:\+7|(?:\D*\d){11}\D*)$/gi,
        },
      ]);
    });

    const fileFields = form.querySelectorAll('.input-file');

    fileFields.forEach((file) => {
      validator.addField(
        file,
        [
          {
            rule: 'files',
            value: {
              files: {
                maxSize: 10_485_760, // 10 MB
              },
            },
            errorMessage: 'Превышен максимальный размер файла',
          },
          {
            rule: 'files',
            value: {
              files: {
                extensions: ['jpeg', 'jpg', 'png'],
                types: ['image/jpeg', 'image/jpg', 'image/png'],
              },
            },
            errorMessage: 'Некорректный формат файла',
          },
        ],
        { errorsContainer: '.files-container-errors', validateBeforeSubmitting: true },
      );
    });

    validator.onSuccess((e) => {
      /* Temporary solution */
      form.classList.add('is-submitted');
    });
  });
}
