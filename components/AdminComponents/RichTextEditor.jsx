// components/RichTextEditor.js
import React from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function RichTextEditor({ value, onChange }) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={RichTextEditor.modules}
      formats={RichTextEditor.formats}
      className="h-50 mb-4 " // Adjust the height as needed
    />
  );
}

RichTextEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
  ],
};

RichTextEditor.formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];
