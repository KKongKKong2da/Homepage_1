/**
 * Princess Dev Diary - Firebase 연동 버전
 * 
 * 기능:
 * - 로컬 스토리지 및 Firebase 이중 저장
 * - 반응형 디자인 지원
 * - 이미지 업로드
 * - 리치 텍스트 에디터
 * 
 * @author Princess Dev
 * @version 2.0.0
 */

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

// --- Firebase 설정 ---
let useFirebase = true; // Firebase 사용 여부 (기본값 true)
let firebaseReady = false; // Firebase 초기화 완료 여부

// Firebase 초기화 확인
function checkFirebaseReady() {
  if (window.firebase && window.firebase.db) {
    firebaseReady = true;
    console.log('Firebase가 준비되었습니다!');
    return true;
  }
  return false;
}

// Firebase 사용 여부 확인 (로컬 스토리지에서 설정 읽기)
function loadFirebaseSetting() {
  const setting = localStorage.getItem('useFirebase');
  if (setting === null) {
    useFirebase = true; // 기본값: Firebase ON
    localStorage.setItem('useFirebase', 'true');
  } else {
    useFirebase = setting === 'true';
  }
  console.log('Firebase 사용 설정:', useFirebase);
}

// Firebase 사용 여부 토글
window.toggleFirebase = function() {
  useFirebase = !useFirebase;
  localStorage.setItem('useFirebase', useFirebase.toString());
  
  // Firebase 버튼 상태 업데이트
  const firebaseBtn = $('#firebase-toggle');
  if (firebaseBtn) {
    if (useFirebase && firebaseReady) {
      firebaseBtn.textContent = '🔥';
      firebaseBtn.title = 'Firebase ON';
      firebaseBtn.classList.add('active');
    } else if (useFirebase && !firebaseReady) {
      firebaseBtn.textContent = '⚠️';
      firebaseBtn.title = 'Firebase 설정 필요';
      firebaseBtn.classList.remove('active');
      useFirebase = false;
    } else {
      firebaseBtn.textContent = '❄️';
      firebaseBtn.title = 'Firebase OFF';
      firebaseBtn.classList.remove('active');
    }
  }
  
  const dataStatus = $('#data-status');
  if (dataStatus) {
    if (useFirebase && firebaseReady) {
      dataStatus.innerHTML = '🔥 Firebase 모드: 데이터가 클라우드에 저장됩니다.';
    } else if (useFirebase && !firebaseReady) {
      dataStatus.innerHTML = '⚠️ Firebase 설정이 필요합니다. (로컬 모드로 동작)';
      useFirebase = false;
    } else {
      dataStatus.innerHTML = '💾 로컬 모드: 데이터가 브라우저에 저장됩니다.';
    }
  }
  
  // 설정 변경 후 글 목록 다시 로드
  loadPosts();
};

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
    // 붙여넣기 시 모든 스타일 속성 제거, 구조는 유지
    editableDiv.addEventListener('paste', function(e) {
      if (!(e.clipboardData && e.clipboardData.getData('text/html'))) return;
      e.preventDefault();
      let html = e.clipboardData.getData('text/html');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      function cleanAllStyle(node) {
        if (node.nodeType === 1) {
          node.removeAttribute('style');
          node.removeAttribute('class');
          node.removeAttribute('color');
          node.removeAttribute('bgcolor');
          node.removeAttribute('background');
          node.removeAttribute('font-size');
          // 폰트 태그는 span으로 변환
          if (node.nodeName === 'FONT') {
            const span = document.createElement('span');
            span.innerHTML = node.innerHTML;
            node.parentNode.replaceChild(span, node);
            node = span;
          }
          Array.from(node.childNodes).forEach(cleanAllStyle);
        }
      }
      Array.from(tempDiv.childNodes).forEach(cleanAllStyle);
      document.execCommand('insertHTML', false, tempDiv.innerHTML);
    });
  }
  if (newPostBtn) newPostBtn.onclick = () => openModal();
  if (closeBtn) closeBtn.onclick = closeModal;
  window.onclick = e => { if (e.target === postModal) closeModal(); };
  if (postImageInput) postImageInput.onchange = onImageChange;
  if (postForm) postForm.onsubmit = onFormSubmit;
}

// --- Firebase 데이터 저장 ---
async function savePostToFirebase(post) {
  try {
    const { collection, addDoc } = window.firebase;
    const postsRef = collection(window.firebase.db, 'posts');
    
    // 이미지가 있으면 Storage에 업로드
    let imageUrl = null;
    if (post.image && post.image.startsWith('data:')) {
      const { ref, uploadBytes, getDownloadURL } = window.firebase;
      const imageRef = ref(window.firebase.storage, `posts/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
      
      // Base64를 Blob으로 변환
      const response = await fetch(post.image);
      const blob = await response.blob();
      
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }
    
    const postData = {
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      image: imageUrl || post.image,
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(postsRef, postData);
    console.log('Firebase에 저장됨:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Firebase 저장 오류:', error);
    throw error;
  }
}

// --- Firebase 데이터 로드 ---
async function loadPostsFromFirebase() {
  try {
    const { collection, getDocs } = window.firebase;
    const postsRef = collection(window.firebase.db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Firebase 로드 오류:', error);
    throw error;
  }
}

// --- Firebase 데이터 수정 ---
async function updatePostInFirebase(postId, post) {
  try {
    const { doc, updateDoc } = window.firebase;
    const postRef = doc(window.firebase.db, 'posts', postId);
    
    const updateData = {
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // 이미지가 새로 업로드된 경우
    if (post.image && post.image.startsWith('data:')) {
      const { ref, uploadBytes, getDownloadURL } = window.firebase;
      const imageRef = ref(window.firebase.storage, `posts/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
      
      const response = await fetch(post.image);
      const blob = await response.blob();
      
      await uploadBytes(imageRef, blob);
      updateData.image = await getDownloadURL(imageRef);
    }
    
    await updateDoc(postRef, updateData);
    console.log('Firebase 수정됨:', postId);
  } catch (error) {
    console.error('Firebase 수정 오류:', error);
    throw error;
  }
}

// --- Firebase 데이터 삭제 ---
async function deletePostFromFirebase(postId) {
  try {
    const { doc, deleteDoc } = window.firebase;
    const postRef = doc(window.firebase.db, 'posts', postId);
    await deleteDoc(postRef);
    console.log('Firebase 삭제됨:', postId);
  } catch (error) {
    console.error('Firebase 삭제 오류:', error);
    throw error;
  }
}

// --- 데이터 백업 기능 ---
window.exportData = async function() {
  try {
    let posts;
    if (useFirebase && firebaseReady) {
      posts = await loadPostsFromFirebase();
    } else {
      posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }
    
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `princess_posts_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('데이터가 백업되었습니다!');
  } catch (error) {
    console.error('백업 오류:', error);
    alert('백업 중 오류가 발생했습니다.');
  }
};

// --- 데이터 복구 기능 ---
window.importData = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function(e) {
        try {
          const posts = JSON.parse(e.target.result);
          if (Array.isArray(posts)) {
            if (!confirm('기존 데이터를 모두 삭제하고 복구하시겠습니까?\n(확인: 기존 데이터 삭제 후 복구, 취소: 복구 취소)')) return;
            // 기존 데이터 삭제
            if (useFirebase && firebaseReady) {
              // Firebase의 모든 글 삭제 (간단하게는 컬렉션 전체 삭제가 어려우므로, 기존 글을 모두 불러와서 하나씩 삭제)
              const existingPosts = await loadPostsFromFirebase();
              for (const post of existingPosts) {
                await deletePostFromFirebase(post.id);
              }
              // 복구
              for (const post of posts) {
                await savePostToFirebase(post);
              }
              alert('데이터가 Firebase에 복구되었습니다!');
            } else {
              // 로컬 스토리지의 모든 글 삭제
              localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
              // 복구
              localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
              alert('데이터가 로컬에 복구되었습니다!');
            }
            loadPosts();
          } else {
            alert('올바른 백업 파일이 아닙니다.');
          }
        } catch (error) {
          console.error('복구 오류:', error);
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
  } else if (tag === 'code') {
    // 인라인 코드: 선택 영역을 <code>...</code>로 감싸기
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const codeElem = document.createElement('code');
        codeElem.textContent = selectedText;
        range.deleteContents();
        range.insertNode(codeElem);
      }
    }
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
async function loadPosts() {
  let posts;
  if (useFirebase && firebaseReady) {
    posts = await loadPostsFromFirebase();
  } else {
    posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  // 최신 날짜-시간-제목 순으로 정렬
  posts.sort((a, b) => {
    // 날짜+시간 비교 (ISO 형식이면 시간까지 비교됨)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (!isNaN(dateA) && !isNaN(dateB)) {
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      // 날짜+시간이 같으면 제목 ㄱㄴㄷ
      return (a.title || '').localeCompare(b.title || '', 'ko');
    }
    // 날짜 파싱이 안 되면 제목 ㄱㄴㄷ
    return (a.title || '').localeCompare(b.title || '', 'ko');
  });

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
  
  posts.forEach(post => {
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

async function onFormSubmit(e) {
  e.preventDefault();
  const id = postIdInput.value ? postIdInput.value : undefined;
  const title = postTitleInput.value.trim();
  let content = editableDiv.innerHTML.trim();
  content = cleanContent(content);
  // 사용자가 입력한 날짜만 저장
  const dateStr = postDateInput.value;
  const createdAt = `${dateStr}`;
  let image = '';
  if (postImageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async e => {
      image = e.target.result;
      await savePost({ id, title, content, image, createdAt });
    };
    reader.readAsDataURL(postImageInput.files[0]);
    return;
  } else if (imagePreview.querySelector('img')) {
    image = imagePreview.querySelector('img').src;
  }
  await savePost({ id, title, content, image, createdAt });
}

// --- 글 저장/수정 ---
async function savePost(post) {
  try {
    if (useFirebase && firebaseReady) {
      // Firebase에 저장
      if (post.id) { // id가 있으면 수정
        await updatePostInFirebase(post.id, post);
      } else {
        // 새 글 저장
        const newId = await savePostToFirebase(post);
        post.id = newId;
      }
    } else {
      // 로컬 스토리지에 저장
      let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const idx = posts.findIndex(p => p.id === post.id);
      if (idx > -1) {
        posts[idx] = post;
      } else {
        // 새 글이면 id를 생성해서 부여
        post.id = post.id || Date.now().toString();
        posts.push(post);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
    
    closeModal();
    await loadPosts();
  } catch (error) {
    console.error('저장 오류:', error);
    alert('저장 중 오류가 발생했습니다.');
  }
}

// --- 글 수정 ---
window.editPost = async function(id) {
  try {
    let post;
    if (useFirebase && firebaseReady) {
      // Firebase에서 글 가져오기
      const { collection, getDocs, doc, getDoc } = window.firebase;
      const postsRef = collection(window.firebase.db, 'posts');
      const querySnapshot = await getDocs(postsRef);
      
      for (const docSnapshot of querySnapshot.docs) {
        if (docSnapshot.id === id) {
          post = { id: docSnapshot.id, ...docSnapshot.data() };
          break;
        }
      }
    } else {
      // 로컬 스토리지에서 글 가져오기
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      post = posts.find(p => p.id === id);
    }
    
    if (post) openModal(true, post);
  } catch (error) {
    console.error('글 수정 오류:', error);
    alert('글을 불러오는 중 오류가 발생했습니다.');
  }
};

// --- 글 삭제 ---
window.deletePost = async function(id) {
  if (!confirm('정말 삭제할까요?')) return;
  
  try {
    if (useFirebase && firebaseReady) {
      // Firebase에서 삭제
      await deletePostFromFirebase(id);
    } else {
      // 로컬 스토리지에서 삭제
      let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
    
    await loadPosts();
  } catch (error) {
    console.error('삭제 오류:', error);
    alert('삭제 중 오류가 발생했습니다.');
  }
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

// Firebase 초기화 확인 및 설정 로드
function initializeApp() {
  // Firebase 준비 상태 확인
  const checkInterval = setInterval(() => {
    if (checkFirebaseReady()) {
      clearInterval(checkInterval);
      loadFirebaseSetting();
      
      // Firebase 버튼 상태 업데이트
      const firebaseBtn = $('#firebase-toggle');
      if (firebaseBtn) {
        if (useFirebase && firebaseReady) {
          firebaseBtn.textContent = '🔥';
          firebaseBtn.title = 'Firebase ON';
          firebaseBtn.classList.add('active');
        } else {
          firebaseBtn.textContent = '❄️';
          firebaseBtn.title = 'Firebase OFF';
          firebaseBtn.classList.remove('active');
        }
      }
      
      // 데이터 상태 표시 업데이트
      const dataStatus = $('#data-status');
      if (dataStatus) {
        if (useFirebase && firebaseReady) {
          dataStatus.innerHTML = '🔥 Firebase 모드: 데이터가 클라우드에 저장됩니다.';
        } else {
          dataStatus.innerHTML = '💾 로컬 모드: 데이터가 브라우저에 저장됩니다.';
        }
      }
      
      loadPosts();
    }
  }, 100);
  
  // 5초 후에도 Firebase가 준비되지 않으면 로컬 모드로 시작
  setTimeout(() => {
    clearInterval(checkInterval);
    if (!firebaseReady) {
      console.log('Firebase 초기화 실패, 로컬 모드로 시작합니다.');
      loadFirebaseSetting();
      loadPosts();
    }
  }, 5000);
}

initializeApp();

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