import BaseComponent from './BaseComponent';

const uploaderSelector = '[data-files-uploader]';

class FilesUploader extends BaseComponent {
  stateClasses = {
    isLoaded: 'file-is-loaded',
  };

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.filesField = this.rootElement.querySelector('.files-field');
    this.filesInput = this.rootElement.querySelector('.input-file[multiple]');
    this.state = this.getProxyState({ filesArray: [] });

    this.bindEvents();
  }

  updateUI() {
    const { filesArray } = this.state;
    const { isLoaded } = this.stateClasses;

    if (filesArray.length > 0) {
      this.filesField.classList.add(isLoaded);
    } else {
      this.filesField.classList.remove(isLoaded);
    }

    console.log(filesArray);
  }

  createFilePreview(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContainer = document.createElement('div');
      const filePreview = document.createElement('img');
      const fileRemove = document.createElement('button');

      fileContainer.classList.add('file-container');
      filePreview.classList.add('file-preview');
      fileRemove.classList.add('file-remove');
      fileRemove.setAttribute('aria-label', 'Удалить файл');
      fileRemove.setAttribute('type', 'button');

      filePreview.src = e.target.result;

      fileRemove.addEventListener('click', () => {
        this.removeFile(file);
      });

      fileContainer.appendChild(filePreview);
      fileContainer.appendChild(fileRemove);
      this.rootElement.appendChild(fileContainer);

      // Store a reference to the fileContainer in the file object
      file.previewElement = fileContainer;
    };

    reader.readAsDataURL(file);
  }

  addFiles(newFiles) {
    const { filesArray } = this.state;

    // Filter out duplicate files
    const uniqueFiles = newFiles.filter((newFile) => {
      return !filesArray.some(
        (existingFile) => existingFile.name === newFile.name && existingFile.type === newFile.type,
      );
    });

    // Add unique files to filesArray
    this.state.filesArray = filesArray.concat(uniqueFiles);

    // Create previews only for the new unique files
    uniqueFiles.forEach((file) => this.createFilePreview(file));
  }

  removeFile(file) {
    const { filesArray } = this.state;

    // Remove the file from filesArray
    const fileIndex = filesArray.indexOf(file);
    if (fileIndex !== -1) {
      filesArray.splice(fileIndex, 1);
      this.state.filesArray = filesArray;
    }

    // Remove the preview element from the DOM
    if (file.previewElement) {
      file.previewElement.remove();
    }

    // Update the input's files property
    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => {
      dataTransfer.items.add(file);
    });
    this.filesInput.files = dataTransfer.files;

    this.updateUI();
  }

  onFilesInputChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      this.addFiles(newFiles);
    }
  };

  bindEvents() {
    this.filesInput.addEventListener('change', this.onFilesInputChange);
  }
}

export default class initFilesUploader {
  constructor() {
    this.init();
  }

  init() {
    const filesUploaders = document.querySelectorAll(uploaderSelector);
    filesUploaders.forEach((filesUploader) => new FilesUploader(filesUploader));
  }
}
