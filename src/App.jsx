import React, { useState, useEffect } from "react";
import { marked } from "marked";
import { supabase } from "./lib/supabaseClient";

// 简单 UI 组件
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-md border ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
    />
  );
}
function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
    ></textarea>
  );
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");

  // ✅ 从 Supabase 加载笔记
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("加载笔记失败：", error.message);
    } else {
      setNotes(data);
    }
  };

  // ✅ 添加新笔记到 Supabase
  const handleAddNote = async () => {
    if (title.trim() === "" || markdown.trim() === "") return;

    const { data, error } = await supabase.from("notes").insert([
      {
        title,
        markdown,
      },
    ]);

    if (error) {
      console.error("添加失败：", error.message);
    } else {
      setTitle("");
      setMarkdown("");
      fetchNotes(); // 重新加载
    }
  };

  // ✅ 初始化加载
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📓 Markdown 记事本（云同步）</h1>

      <Card className="mb-6">
        <CardContent className="space-y-4">
          <Input
            placeholder="标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="写点什么...（支持 Markdown）"
            rows={6}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
          <Button onClick={handleAddNote}>添加笔记</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(note.markdown) }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
