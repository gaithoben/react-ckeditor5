import React, { Component } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount";

import "./ckeditor.css";

// export class ClassicEditor extends ClassicEditorBase {}

export default class CKEditor extends Component {
  static defaultProps = {
    uploadUrl: "/fileapi/upload/editorimage",
    value: "<p>&nbsp;</p>",
    input: {
      value: "<p>&nbsp;</p>",
      onChange: () => {},
      onBlur: () => {}
    },
    meta: {},
    onChange: () => {},
    imageplugin: false,
    headingplugin: false
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
      defaultValue: "<p>&nbsp;</p>",
      firstUpdate: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.editor && this.editor.setData && !this.state.firstUpdate) {
      const editordata = this.editor.getData();
      if (editordata !== this.state.defaultValue) {
        this.editor.setData(this.state.defaultValue);
        this.setState({ firstUpdate: true });
      }
    }
  }

  onChange(data) {
    this.setState({ defaultValue: data }, () => {
      this.props.input.onChange(data);
      this.props.onChange(data);
      this.props.input.onBlur();
    });
  }

  onInitialized = () => {
    if (this.editor && this.editor.setData && !this.state.firstUpdate) {
      const editordata = this.editor.getData();
      if (editordata !== this.state.defaultValue) {
        this.editor.setData(this.state.defaultValue);
        this.setState({ firstUpdate: true });
      }
    }

    setTimeout(() => {
      this.setState({ firstUpdate: true });
    }, 1000);
  };

  componentWillUnmount() {
    this.setState({ firstUpdate: false });
  }
  componentDidMount = () => {
    ClassicEditor.create(this.el, {
      plugins: [
        Essentials,
        Autoformat,
        Bold,
        Italic,
        BlockQuote,
        CKFinder,
        EasyImage,
        Heading,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        SimpleUploadAdapter,
        Indent,
        Link,
        List,
        MediaEmbed,
        Paragraph,
        Table,
        TableToolbar,
        Alignment,
        HorizontalLine,
        WordCount
      ],
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "alignment",
          "|",
          "indent",
          "outdent",
          "|",
          "imageUpload",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "undo",
          "redo",
          "horizontalLine"
        ]
      },
      image: {
        toolbar: [
          "imageStyle:full",
          "imageStyle:side",
          "|",
          "imageTextAlternative"
        ]
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
      },
      simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: this.props.uploadUrl,

        // Headers sent along with the XMLHttpRequest to the upload server.
        headers: {
          ...this.props.headers
        }
      },
      wordCount: {
        onUpdate: stats => {
          // Prints the current content statistics.
          console.log(`Characters: ${stats.characters}\nWords: ${stats.words}`);
        }
      },
      // This value must be kept in sync with the language defined in webpack.config.js.
      language: "en"
    })
      .then(editor => {
        console.log(editor);
      })
      .catch(error => {
        console.error(error);
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
      </div>
    );
  }
}
