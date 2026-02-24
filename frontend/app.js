const apiBase = "/api";

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");

async function fetchNotes() {
  const res = await fetch(`${apiBase}/notes`);
  const notes = await res.json();
  listEl.innerHTML = notes.map(n => `
    <div class="note">
      <div class="note-head">
        <strong>${escapeHtml(n.title)}</strong>
        <div>
          <button onclick="editNote(${n.id})">Edit</button>
          <button onclick="deleteNote(${n.id})">Delete</button>
        </div>
      </div>
      <p>${escapeHtml(n.content)}</p>
      <small>${new Date(n.created_at).toLocaleString()}</small>
    </div>
  `).join("");
}

addBtn.addEventListener("click", async () => {
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();
  if (!title || !content) return alert("Please fill title + content");
  await fetch(`${apiBase}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  titleEl.value = "";
  contentEl.value = "";
  fetchNotes();
});

window.deleteNote = async (id) => {
  await fetch(`${apiBase}/notes/${id}`, { method: "DELETE" });
  fetchNotes();
};

window.editNote = async (id) => {
  const newTitle = prompt("New title?");
  const newContent = prompt("New content?");
  if (!newTitle || !newContent) return;
  await fetch(`${apiBase}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, content: newContent })
  });
  fetchNotes();
};

function escapeHtml(str) {
  return str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

fetchNotes();