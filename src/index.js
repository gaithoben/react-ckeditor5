import React, { Component } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadadapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyimagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import ImagecaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImagestylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImagetoolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import ImageuploadPlugin from '@ckeditor/ckeditor5-upload/src/imageupload';
import placeholder from '@ckeditor/ckeditor5-engine/src/view/placeholder';
import './ckeditor.css';

export default class CKEditor extends Component {
  static defaultProps = {
    uploadUrl: '/fileapi/upload/editorimage',
    value: '',
    input: {
      value: '',
      onChange: () => {},
    },
    onChange: () => {},
  };
  constructor(props) {
    super(props);
    this.editor = null;
    this.el = null;
    this.state = {
      defaultValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {}
  handleChange = value => {
    console.log('CHANGED', value);
    this.props.input.onChange(value);
    this.props.onChange(value);
  };

  componentDidMount = () => {
    //   console.log(ClassicEditor.build.plugins.map(plugin => plugin.pluginName)); // plugins
    ClassicEditor.create(this.el, {
      plugins: [
        EssentialsPlugin,
        UploadadapterPlugin,
        AutoformatPlugin,
        BoldPlugin,
        ItalicPlugin,
        BlockquotePlugin,
        EasyimagePlugin,
        HeadingPlugin,
        ImagePlugin,
        ImagecaptionPlugin,
        ImagestylePlugin,
        ImagetoolbarPlugin,
        LinkPlugin,
        ListPlugin,
        ParagraphPlugin,
        ImageuploadPlugin,
      ],
      toolbar: [
        'headings',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'insertimage',
        'imageStyleAlignLeft',
        'imageStyleFull',
        'imageStyleAlignRight',
      ],
      image: {
        // You need to configure the image toolbar too, so it uses the new style buttons.
        toolbar: [
          'imageTextAlternative',
          '|',
          'imageStyleAlignLeft',
          'imageStyleFull',
          'imageStyleAlignRight',
        ],

        styles: [
          // This option is equal to a situation where no style is applied.
          'imageStyleFull',

          // This represents an image aligned to left.
          'imageStyleAlignLeft',

          // This represents an image aligned to right.
          'imageStyleAlignRight',
        ],
      },
      ckfinder: {
        uploadUrl: this.props.uploadUrl,
      },
      placeholder: 'Type here...',
    })
      .then(editor => {
        this.editor = editor;
        // console.log( 'Editor was initialized', editor );
        // const arr = Array.from(editor.ui.componentFactory.names());

        // console.log(arr); // toolbar
        const viewDoc = editor.editing.view;
        this.editor.setData(
          `<div>${this.props.value || this.props.input.value}</div>`
        );
        this.editor.document.on('change', () => {
          this.handleChange(this.editor.getData());
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}
