// Princess Blog Script (리팩토링 버전)

// --- DOM 요소 선언 ---
const STORAGE_KEY = 'princess_posts';
const $ = selector => document.querySelector(selector);
const postsContainer = $('#posts-container');
const newPostBtn = $('#new-post-btn');
const postModal = $('#post-modal');
const closeBtn = $('.close-btn');
const postForm = $('#post-form');
const postIdInput = $('#post-id');
const postTitleInput = $('#post-title');
const postDateInput = $('#post-date');
const postImageInput = $('#post-image');
const imagePreview = $('#image-preview');
const modalTitle = $('#modal-title');
const editableDiv = $('#post-content');
const toolbar = $('#toolbar');

// --- 이벤트 등록 ---
function registerEvents() {
  if (toolbar && editableDiv) {
    toolbar.addEventListener('click', onToolbarClick);
  }
  if (editableDiv) {
    editableDiv.addEventListener('input', updateToolbarActive);
    editableDiv.addEventListener('keyup', updateToolbarActive);
    editableDiv.addEventListener('mouseup', updateToolbarActive);
    document.addEventListener('selectionchange', onSelectionChange);
    // 붙여넣기 시 <ol>, <ul>, <li>만 유지하고 나머지는 일반 텍스트로 변환
    editableDiv.addEventListener('paste', function(e) {
      e.preventDefault();
      let html = '';
      if (e.clipboardData && e.clipboardData.getData('text/html')) {
        html = e.clipboardData.getData('text/html');
        // <ol>, <ul>, <li>만 남기고 나머지 태그 제거
        html = html
          .replace(/<(?!\/?(ol|ul|li)\b)[^>]+>/gi, '') // 허용된 태그 외 모두 제거
          .replace(/<\/?(span|div|p|br|b|u|s|a|table|tr|td|th|thead|tbody|tfoot|img|h[1-6]|pre|code)[^>]*>/gi, '')
          .replace(/style="[^"]*"/gi, ''); // 혹시 남은 style 속성도 제거
        document.execCommand('insertHTML', false, html);
      } else {
        // HTML이 없으면 plain text로 처리
        let text = '';
        if (e.clipboardData) {
          text = e.clipboardData.getData('text/plain');
        } else if (window.clipboardData) {
          text = window.clipboardData.getData('Text');
        }
        document.execCommand('insertText', false, text);
      }
    });
  }
  if (newPostBtn) newPostBtn.onclick = () => openModal();
  if (closeBtn) closeBtn.onclick = closeModal;
  window.onclick = e => { if (e.target === postModal) closeModal(); };
  if (postImageInput) postImageInput.onchange = onImageChange;
  if (postForm) postForm.onsubmit = onFormSubmit;
}

// --- 데이터 백업 기능 ---
window.exportData = function() {
  const posts = localStorage.getItem(STORAGE_KEY) || '[]';
  const blob = new Blob([posts], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `princess_posts_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('데이터가 백업되었습니다!');
};

// --- 데이터 복구 기능 ---
window.importData = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const posts = JSON.parse(e.target.result);
          if (Array.isArray(posts)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadPosts();
            alert('데이터가 복구되었습니다!');
          } else {
            alert('올바른 백업 파일이 아닙니다.');
          }
        } catch (error) {
          alert('파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

// --- 툴바 버튼 클릭 핸들러 ---
function onToolbarClick(e) {
  if (!e.target.closest('.toolbar-btn')) return;
  const btn = e.target.closest('.toolbar-btn');
  const tag = btn.dataset.tag;
  editableDiv.focus();
  if (tag === 'b') {
    document.execCommand('bold');
  } else if (tag === 'u') {
    document.execCommand('underline');
  } else if (tag === 's') {
    document.execCommand('strikeThrough');
  } else if (tag === 'a') {
    const url = prompt('링크 주소를 입력하세요:', 'https://');
    if (url) document.execCommand('createLink', false, url);
  } else if (tag === 'ol') {
    document.execCommand('insertOrderedList');
  } else if (tag === 'ul') {
    document.execCommand('insertUnorderedList');
  }
  setTimeout(updateToolbarActive, 0);
}

// --- 툴바 버튼 활성화 상태 갱신 ---
function updateToolbarActive() {
  if (!toolbar) return;
  const states = {
    b: document.queryCommandState('bold'),
    u: document.queryCommandState('underline'),
    s: document.queryCommandState('strikeThrough'),
    a: document.queryCommandState('createLink'),
    ol: document.queryCommandState('insertOrderedList'),
    ul: document.queryCommandState('insertUnorderedList'),
  };
  toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
    const tag = btn.dataset.tag;
    if (states[tag]) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// --- selectionchange 핸들러 ---
function onSelectionChange() {
  const sel = window.getSelection();
  if (sel && sel.anchorNode && editableDiv.contains(sel.anchorNode)) {
    updateToolbarActive();
  }
}

// --- 이미지 미리보기 ---
function onImageChange() {
  const file = postImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.innerHTML = `<img src="${e.target.result}">`;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = '';
  }
}

// --- 글 목록 불러오기 및 렌더링 ---
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  postsContainer.innerHTML = '';
  
  // 데이터 상태 표시
  const dataStatus = $('#data-status');
  if (dataStatus) {
    if (posts.length === 0) {
      dataStatus.innerHTML = '📝 저장된 글이 없습니다. 새 글을 작성해보세요!';
    } else {
      dataStatus.innerHTML = `📚 총 ${posts.length}개의 글이 저장되어 있습니다.`;
    }
  }
  
  posts.slice().reverse().forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    // createdAt 포맷 변환
    let createdAt = post.createdAt || '';
    if (/\d{4}. \d{2}. \d{2}/.test(createdAt)) {
      createdAt = normalizeDateString(createdAt);
    }
    // 본문 날짜 포맷 변환
    let content = post.content.replace(/\n/g, '<br>');
    content = normalizeDateString(content);
    postDiv.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-date">${createdAt || '작성 시간 없음'}</div>
      <div class="post-content">${content}</div>
      ${post.image ? `<img class="post-image" src="${post.image}" alt="첨부 이미지">` : ''}
      <div class="post-actions">
        <button onclick="editPost('${post.id}')">수정</button>
        <button onclick="deletePost('${post.id}')">삭제</button>
      </div>
    `;
    postsContainer.appendChild(postDiv);
  });
}

// --- 모달 열기/닫기 및 초기화 ---
function openModal(edit = false, post = null) {
  if (!postModal) return;
  postModal.classList.remove('hidden');
  if (edit && post) {
    modalTitle.textContent = '글 수정하기';
    postIdInput.value = post.id;
    postTitleInput.value = post.title;
    // 날짜 설정
    if (post.createdAt) {
      const date = new Date(post.createdAt);
      if (!isNaN(date.getTime())) {
        postDateInput.value = date.toISOString().split('T')[0];
      } else {
        // 기존 날짜 형식이 YYYY-MM-DD 등인 경우
        const dateMatch = post.createdAt.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          postDateInput.value = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
        } else {
          // 현재 날짜로 설정
          const now = new Date();
          postDateInput.value = now.toISOString().split('T')[0];
        }
      }
    } else {
      const now = new Date();
      postDateInput.value = now.toISOString().split('T')[0];
    }
    editableDiv.innerHTML = post.content;
    if (post.image) {
      imagePreview.innerHTML = `<img src="${post.image}">`;
    } else {
      imagePreview.innerHTML = '';
    }
  } else {
    modalTitle.textContent = '새 글 쓰기';
    postIdInput.value = '';
    postTitleInput.value = '';
    // 현재 날짜로 설정
    const now = new Date();
    postDateInput.value = now.toISOString().split('T')[0];
    editableDiv.innerHTML = '';
    imagePreview.innerHTML = '';
    postImageInput.value = '';
  }
  updateToolbarActive();
}
function closeModal() {
  if (!postModal) return;
  postModal.classList.add('hidden');
}

// --- 글 저장/수정 폼 제출 ---
function cleanContent(html) {
  // <pre>, <code> 태그 제거
  return html.replace(/<\/?pre[^>]*>/gi, '').replace(/<\/?code[^>]*>/gi, '');
}

function onFormSubmit(e) {
  e.preventDefault();
  const id = postIdInput.value || Date.now().toString();
  const title = postTitleInput.value.trim();
  let content = editableDiv.innerHTML.trim();
  content = cleanContent(content);
  // 사용자가 입력한 날짜만 저장
  const dateStr = postDateInput.value;
  const createdAt = `${dateStr}`;
  let image = '';
  if (postImageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      image = e.target.result;
      savePost({ id, title, content, image, createdAt });
    };
    reader.readAsDataURL(postImageInput.files[0]);
    return;
  } else if (imagePreview.querySelector('img')) {
    image = imagePreview.querySelector('img').src;
  }
  savePost({ id, title, content, image, createdAt });
}

// --- 글 저장/수정 ---
function savePost(post) {
  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx > -1) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  closeModal();
  loadPosts();
}

// --- 글 수정 ---
window.editPost = function(id) {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const post = posts.find(p => p.id === id);
  if (post) openModal(true, post);
};

// --- 글 삭제 ---
window.deletePost = function(id) {
  if (!confirm('정말 삭제할까요?')) return;
  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  loadPosts();
};

// --- 데이터 복구 도구 ---
window.checkData = function() {
  const posts = localStorage.getItem(STORAGE_KEY);
  console.log('저장된 데이터:', posts);
  if (posts) {
    try {
      const parsed = JSON.parse(posts);
      console.log('파싱된 데이터:', parsed);
      console.log('글 개수:', parsed.length);
    } catch (e) {
      console.error('데이터 파싱 오류:', e);
    }
  } else {
    console.log('저장된 데이터가 없습니다.');
  }
};

window.clearData = function() {
  if (confirm('정말 모든 데이터를 삭제하시겠습니까?')) {
    localStorage.removeItem(STORAGE_KEY);
    loadPosts();
    alert('데이터가 삭제되었습니다.');
  }
};

// --- 초기화 ---
registerEvents();
loadPosts();

// 날짜 포맷 함수 (YYYY-MM-DD HH:mm)
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

// 날짜 포맷 변환 함수 (YYYY. MM. DD. 또는 YYYY.MM.DD → YYYY-MM-DD)
function normalizeDateString(str) {
  // 2025. 07. 05. 또는 2025.07.05 또는 2025. 07. 05 등
  return str.replace(/(\d{4})[.\-\/]\s?(\d{2})[.\-\/]\s?(\d{2})[.]?/g, (match, y, m, d) => `${y}-${m}-${d}`);
} 