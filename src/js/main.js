/**
  Inintial checks & settings
========================== **/
import { initBrowserChecks, applyInitialSettings } from './utils/utils';

initBrowserChecks();
applyInitialSettings();

/**
  Components
========== **/
import initFilesUploader from './components/FilesUploader';

new initFilesUploader();

/**
  Vendor libs settings
==================== **/
import { initIMask } from './libs/imask-settings';
import { initJustValidate } from './libs/just-validate-settings';

initIMask();
initJustValidate();
