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
    value: '<p>&nbsp;</p>',
    input: {
      value: '<p>&nbsp;</p>',
      onChange: () => {},
    },
    meta: {},
    onChange: () => {},
    imageplugin: false,
    headingplugin: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const val = `${nextProps.input.value || nextProps.value}`;
    if (val !== prevState.defaultValue) {
      return { ...prevState, defaultValue: val };
    }
    return { ...prevState };
  }
  constructor(props) {
    super(props);
    this.editor = null;
    this.el = null;
    this.state = {
      defaultValue: '<p>&nbsp;</p>',
    };
  }
  handleChange = value => {
    console.log('VAL', value);
    this.setState({ defaultValue: value }, () => {
      this.props.input.onChange(value);
      this.props.onChange(value);
    });
  };

  componentDidMount = () => {
    //   console.log(ClassicEditor.build.plugins.map(plugin => plugin.pluginName)); // plugins

    const imageplugins = this.props.imageplugin
      ? [
          EasyimagePlugin,
          ImagePlugin,
          ImagecaptionPlugin,
          ImagestylePlugin,
          ImagetoolbarPlugin,
          ImageuploadPlugin,
        ]
      : [];

    const headingplugin = this.props.headingplugin ? [HeadingPlugin] : [];

    const imagestoolbar = this.props.imageplugin
      ? [
          'insertimage',
          'imageStyleAlignLeft',
          'imageStyleFull',
          'imageStyleAlignRight',
        ]
      : [];
    const headingtoolbar = this.props.headingplugin ? ['headings'] : [];

    ClassicEditor.create(this.el, {
      plugins: [
        EssentialsPlugin,
        UploadadapterPlugin,
        ...headingplugin,
        AutoformatPlugin,
        BoldPlugin,
        ItalicPlugin,
        BlockquotePlugin,
        LinkPlugin,
        ListPlugin,
        ParagraphPlugin,
        ...imageplugins,
      ],
      toolbar: [
        ...headingtoolbar,
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'blockQuote',
        ...imagestoolbar,
      ],
      image: this.props.imageplugin
        ? {
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
          }
        : {},
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
        this.editor.setData(this.state.defaultValue);
        this.editor.document.on('change', () => {
          this.handleChange(this.editor.getData());
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { meta } = this.props;

    return (
      <div className="ck-editor-container">
        <div
          ref={el => {
            this.el = el;
          }}
        />
        {meta.touched &&
          meta.error && <div className="error">{meta.error}</div>}
      </div>
    );
  }
}
