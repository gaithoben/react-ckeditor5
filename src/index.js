import React from "react";
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

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

import ReactCKEditor from "@ckeditor/ckeditor5-react";

export class ClassicEditor extends ClassicEditorBase {}

const CKEditor = ({
  input,
  value,
  headers,
  uploadUrl,
  imageplugin,
  headingplugin,
  mediaplugin,
  tableplugin,
  onUpdate,
  onFocus
}) => {
  const val = input.value || value;

  const [data, setData] = React.useState("");

  const Editor = React.useRef(ClassicEditor).current;

  const imageplugins = imageplugin
    ? [EasyImage, Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload]
    : [];

  const mediaplugins = mediaplugin ? [MediaEmbed] : [];

  const headingplugins = headingplugin ? [Heading] : [];

  const tableplugins = tableplugin ? [Table, TableToolbar] : [];

  const imagestoolbar = imageplugin
    ? [
        "insertimage",
        "imageStyleAlignLeft",
        "imageStyleFull",
        "imageStyleAlignRight"
      ]
    : [];
  const headingtoolbar = headingplugin ? ["headings"] : [];

  Editor.builtinPlugins = [
    Essentials,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    CKFinder,
    ...headingplugins,
    ...imageplugins,
    ...mediaplugins,
    SimpleUploadAdapter,
    Indent,
    Link,
    List,
    Paragraph,
    ...tableplugins,
    Alignment,
    HorizontalLine,
    WordCount
  ];

  Editor.defaultConfig = {
    toolbar: {
      items: [
        ...(headingplugin ? ["heading", "|"] : []),
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
        ...(imageplugin ? ["imageUpload"] : []),
        ...imagestoolbar,
        "blockQuote",
        ...(tableplugin ? ["insertTable"] : []),
        ...(mediaplugin ? ["mediaEmbed"] : []),
        "undo",
        "redo",
        "horizontalLine"
      ]
    },
    image: imageplugin
      ? {
          toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyleAlignLeft",
            "imageStyleFull",
            "imageStyleAlignRight"
          ],

          styles: [
            // This option is equal to a situation where no style is applied.
            "imageStyleFull",

            // This represents an image aligned to left.
            "imageStyleAlignLeft",

            // This represents an image aligned to right.
            "imageStyleAlignRight"
          ]
        }
      : {},
    table: tableplugin
      ? {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
        }
      : {},
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: uploadUrl,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        ...headers
      }
    },
    wordCount: {
      onUpdate: stats => {
        // Prints the current content statistics.
        onUpdate(stats);
      }
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en"
  };

  React.useEffect(() => {
    if (val) {
      setData(val);
    }
  }, [val]);

  return (
    <ReactCKEditor
      editor={Editor}
      data={data}
      onInit={editor => {
        // You can store the "editor" and use when it is needed.
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        if (typeof input.onChange === "function") {
          input.onChange(data);
        }
        if (typeof onChange === "function") {
          onChange(data);
        }
      }}
      onBlur={(event, editor) => {
        if (typeof input.onBlur === "function") {
          input.onBlur();
        }
      }}
      onFocus={(event, editor) => {
        if (typeof onFocus === "function") {
          onFocus();
        }
      }}
    />
  );
};

CKEditor.defaultProps = {
  uploadUrl: "/fileapi/upload/editorimage",
  value: "<p>&nbsp;</p>",
  input: {
    value: "<p>&nbsp;</p>",
    onChange: () => {},
    onBlur: () => {}
  },
  headers: {},
  meta: {},
  onChange: () => {},
  onUpdate: () => {},
  onFocus: () => {},
  imageplugin: false,
  headingplugin: false,
  mediaplugin: false,
  tableplugin: false
};
export default CKEditor;
