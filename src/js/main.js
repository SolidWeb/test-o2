/**
  Inintial checks & settings
========================== **/
import { initBrowserChecks, applyInitialSettings } from './utils/utils';

initBrowserChecks();
applyInitialSettings();

/**
  Form elements UX
================ **/

/* Autoresizible textarea */
const textareaFields = document.querySelectorAll('.textarea-field');

textareaFields.forEach((field) => {
  const textarea = field.querySelector('.input-textarea');
  const initialHeight = textarea.offsetHeight;
  const initialOffset = initialHeight - textarea.clientHeight;

  textarea.addEventListener('input', () => {
    textarea.style.height = initialHeight + 'px';
    textarea.style.height = textarea.closest('.dialog')
      ? textarea.scrollHeight + initialOffset + 2 + 'px'
      : textarea.scrollHeight + initialOffset + 'px';
    // Fix clumsy textarea scroll
    textarea.scrollTo(0, textarea.scrollHeight);
  });
});

/* Show uploaded file name */
const fileUploadFields = document.querySelectorAll('.file-field');

fileUploadFields.forEach((field) => {
  const input = field.querySelector('.input-file');
  const label = field.querySelector('.label-file');
  const labelText = label.textContent;

  input.addEventListener('change', (e) => {
    label.textContent = e.target.files.length > 0 ? e.target.files[0].name : labelText;
  });
});

/* Password visibility toggler */
const passwordTogglers = document.querySelectorAll('.password-toggler');

passwordTogglers.forEach((toggler) => {
  toggler.addEventListener('click', () => {
    const input = toggler.nextSibling;
    toggler.classList.toggle('is-active');
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

/* Files */
const filesContainer = document.querySelector('.files-container');
const filesField = document.querySelector('.files-field');
const filesInput = document.querySelector('.input-file[multiple]');

filesInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    filesField.classList.add('file-is-loaded');

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        const fileContainer = document.createElement('div');
        const filePreview = document.createElement('img');
        const fileRemove = document.createElement('button');

        fileContainer.classList.add('file-container');
        filePreview.classList.add('file-preview');
        fileRemove.classList.add('file-remove');
        fileRemove.setAttribute('aria-label', 'Удалить файл');
        fileRemove.setAttribute('type', 'button');

        filePreview.src = event.target.result;

        fileRemove.addEventListener('click', () => {
          filesContainer.removeChild(fileContainer);
          if (filesContainer.children.length === 0) {
            filesField.classList.remove('file-is-loaded');
          }
        });

        fileContainer.appendChild(filePreview);
        fileContainer.appendChild(fileRemove);
        filesContainer.appendChild(fileContainer);
      };
      reader.readAsDataURL(file);
    });
    // const reader = new FileReader();
    // reader.onload = function () {

    //   filePreview.src = reader.result;
    //   filesContainer.appendChild(fileContainer);
    //   fileContainer.appendChild(filePreview);
    //   fileContainer.appendChild(fileRemove);
    // };
    // reader.readAsDataURL(e.target.files[0]);
  }
});

/**
  Vendor libs settings
==================== **/
import { initIMask } from './libs/imask-settings';
import { initJustValidate } from './libs/just-validate-settings';

initIMask();
initJustValidate();
