import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import UploadAdapter from './UploadAdapter';

export default class CKFinderUploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return 'CKFinderUploadAdapter';
  }

  init() {
    const url = this.editor.config.get('ckfinder.uploadUrl');

    if (!url) {
      return;
    }
    this.editor.plugins.get(FileRepository).createUploadAdapter = loader =>
      new UploadAdapter(loader, url, this.editor.t);
  }
}
