/**
  Inintial checks & settings
========================== **/
import { initBrowserChecks, applyInitialSettings } from './utils/utils';

initBrowserChecks();
applyInitialSettings();

/* Files */
const filesContainer = document.querySelector('.files-container');
const filesField = document.querySelector('.files-field');
const filesInput = document.querySelector('.input-file[multiple]');
let filesArray = [];

filesInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    filesField.classList.add('file-is-loaded');

    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter((newFile) => {
      return !filesArray.some(
        (existingFile) => existingFile.name === newFile.name && existingFile.type === newFile.type,
      );
    });

    filesArray = filesArray.concat(uniqueFiles);

    console.log(filesArray);

    uniqueFiles.forEach((file) => {
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

          const fileIndex = filesArray.indexOf(file);
          if (fileIndex !== -1) {
            filesArray.splice(fileIndex, 1);
          }

          const dataTransfer = new DataTransfer();
          filesArray.forEach((file) => {
            dataTransfer.items.add(file);
          });

          filesInput.files = dataTransfer.files;

          if (filesArray.length === 0) {
            filesField.classList.remove('file-is-loaded');
          }
        });

        fileContainer.appendChild(filePreview);
        fileContainer.appendChild(fileRemove);
        filesContainer.appendChild(fileContainer);
      };

      reader.readAsDataURL(file);
    });
  }
});

/**
  Vendor libs settings
==================== **/
import { initIMask } from './libs/imask-settings';
import { initJustValidate } from './libs/just-validate-settings';

initIMask();
initJustValidate();
