import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const chatArea = document.getElementById('chat-area');
    const sendBtn = document.getElementById('send-btn');
    const textInput = document.getElementById('text-input');
    const fileInput = document.getElementById('file-input');
    const themeToggle = document.getElementById('themeToggle');

    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];

    const storedMessages = JSON.parse(localStorage.getItem('chatHistory')) || [];
    storedMessages.forEach(({ msg, cls }) => addChatMessage(msg, cls));

    function saveMessage(msg, cls) {
      const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
      history.push({ msg, cls });
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }

    function addChatMessage(msg, cls) {
      const div = document.createElement('div');
      div.classList.add('message', cls);
      div.textContent = msg;
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
      saveMessage(msg, cls);
    }

    function showTyping() {
      const div = document.createElement('div');
      div.classList.add('message', 'typing');
      div.textContent = 'Bot is typing...';
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
      return div;
    }

    function analyze(text, file) {
      const typingDiv = showTyping();
      setTimeout(() => {
        typingDiv.remove();
        const response = text
          ? `Analyzed text: "${text}" ✅`
          : `Analyzed file: "${file.name}" ✅`;
        addChatMessage(response, 'bot-msg');
      }, 1000);
    }

    sendBtn.addEventListener('click', () => {
      const txt = textInput.value.trim();
      if (!txt) return;
      addChatMessage(txt, 'user-msg');
      analyze(txt);
      textInput.value = '';
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!validTypes.includes(file.type)) {
        alert('Only JPG, PNG images and MP4 videos are allowed!');
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.classList.add('message', 'user-msg');

      const elem = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
      elem.src = URL.createObjectURL(file);
      elem.style.maxWidth = '200px';
      elem.style.borderRadius = '10px';
      if (file.type.startsWith('video/')) elem.controls = true;

      wrapper.appendChild(elem);
      chatArea.appendChild(wrapper);
      analyze(null, file);
    });

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>🛡️ AI Integrity Checker</h1>
        <button id="themeToggle" className="user-icon">🌗</button>
      </div>
      <div className="chat-container" id="chat-area"></div>
      <div className="input-bar">
        <input type="text" placeholder="Type your message..." id="text-input" />
        <input type="file" id="file-input" />
        <button id="send-btn">Send</button>
      </div>
    </div>
  );
}

export default App;
