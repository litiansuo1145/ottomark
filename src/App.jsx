import React, { useState, useEffect } from "react";
import { marked } from "marked";
import { createClient } from "@supabase/supabase-js";

// ✅ 初始化 Supabase 客户端
const supabase = createClient(
  "https://qpqeheoxllbqjqjiuszo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcWVoZW94bGxicWpxaml1c3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODMwNzgsImV4cCI6MjA2MTE1OTA3OH0.NNOn_mIyL2ANankXfsESyFZgG0SWT7ws2ZsFkxP5LEk"
);

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-md border ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 ${className}`}
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
  const [editingNoteId, setEditingNoteId] = useState(null); // null 表示未编辑状态

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) {
      setNotes(data);
    } else {
      console.error("加载笔记失败：", error.message);
    }
  };

  const handleAddOrUpdateNote = async () => {
    if (title.trim() === "" || markdown.trim() === "") return;

    if (editingNoteId) {
      // 正在编辑，更新原笔记
      const { error } = await supabase
        .from("notes")
        .update({ title, markdown })
        .eq("id", editingNoteId);

      if (!error) {
        await loadNotes();
        resetForm();
      } else {
        console.error("更新失败：", error.message);
      }
    } else {
      // 新笔记
      const { error } = await supabase.from("notes").insert([{ title, markdown }]);
      if (!error) {
        await loadNotes();
        resetForm();
      } else {
        console.error("添加失败：", error.message);
      }
    }
  };

  const handleEditNote = (note) => {
    setTitle(note.title);
    setMarkdown(note.markdown);
    setEditingNoteId(note.id);
  };

  const resetForm = () => {
    setTitle("");
    setMarkdown("");
    setEditingNoteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📓 Markdown 记事本</h1>

      <Card className="mb-6">
        <CardContent className="space-y-4">
          <Input placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            placeholder="写点什么...（支持 Markdown）"
            rows={6}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddOrUpdateNote}>
              {editingNoteId ? "保存更改" : "添加笔记"}
            </Button>
            {editingNoteId && (
              <Button onClick={resetForm} className="bg-gray-400 hover:bg-gray-500">
                取消编辑
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <Button onClick={() => handleEditNote(note)} className="bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-1">
                  编辑
                </Button>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(note.markdown) }}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
