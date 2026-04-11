// 取得頁面元素
const copyButton = document.getElementById('copyButton');
const notButton = document.getElementById('notButton');
const andButton = document.getElementById('andButton');
const orButton = document.getElementById('orButton');
const clearButton = document.getElementById('clearButton');
const displayTextbox = document.getElementById('displayTextbox');
const toastNotification = document.getElementById('toast-notification');

// 初始化變數
const initialDefaultText = "";
let textToCopyContent = initialDefaultText; // 儲存要複製的文字內容
let nextConnector = null; // 儲存下一個連接詞 ('&' 或 '|')
let isNotActive = false; // 標記 "不是" 功能是否啟用
let toastTimeout = null; // 用於避免 Toast 計時器互相干擾

// 更新顯示文字框內容
function updateDisplayTextBox() {
  displayTextbox.value = textToCopyContent;
}

// 儲存狀態到 localStorage
function saveState() {
  localStorage.setItem('copyflow_text', textToCopyContent);
  localStorage.setItem('copyflow_connector', nextConnector ?? '');
  localStorage.setItem('copyflow_not', isNotActive ? '1' : '0');
}

// 從 localStorage 讀取並還原狀態
function loadState() {
  const savedText = localStorage.getItem('copyflow_text');
  if (savedText !== null) {
    textToCopyContent = savedText;
    nextConnector = localStorage.getItem('copyflow_connector') || null;
    isNotActive = localStorage.getItem('copyflow_not') === '1';
  }
}

// 顯示浮動通知
function showToast(message) {
  if (!toastNotification) return; // 如果通知元素不存在，則不執行

  toastNotification.textContent = message;
  toastNotification.style.display = 'block'; // 顯示通知
  toastNotification.classList.add('show'); // 觸發顯示動畫

  // 清除舊計時器，避免多次點擊時互相干擾
  clearTimeout(toastTimeout);

  // 設定一段時間後隱藏通知
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove('show'); // 觸發隱藏動畫

    // 等待動畫結束後真正隱藏元素
    setTimeout(() => {
      toastNotification.style.display = 'none';
    }, 500);
  }, 3000); // 3秒後隱藏
}

// 處理內容設定按鈕點擊事件
function handleContentButtonClick(newText) {
  let textToAdd = newText;

  // 如果 "不是" 功能啟用，則添加 "!" 前綴
  if (isNotActive) {
    textToAdd = "!" + textToAdd;
    isNotActive = false; // 重置 "不是" 狀態
  }

  // 判斷是否需要連接詞
  if (nextConnector) {
    // 如果已有內容，則附加連接詞和新文字
    if (textToCopyContent === initialDefaultText || textToCopyContent === '') {
      textToCopyContent = textToAdd;
    } else {
      textToCopyContent += nextConnector + textToAdd;
    }
    nextConnector = null; // 重置連接詞狀態
  } else {
    // 沒有連接詞，直接設定新內容
    textToCopyContent = textToAdd;
  }

  updateDisplayTextBox(); // 更新顯示文字框
  saveState(); // 儲存狀態
}

// 初始化時從 localStorage 還原狀態，再更新顯示文字框
loadState();
updateDisplayTextBox();

// 為所有帶有 data-text 屬性的按鈕綁定點擊事件
const buttons = document.querySelectorAll('[data-text]');
buttons.forEach(button => {
  button.addEventListener('click', function () {
    handleContentButtonClick(this.dataset.text);
  });
});

// 「不是」按鈕事件監聽器
notButton.addEventListener('click', function () {
  isNotActive = true;
  saveState();
});

// 「並且」按鈕事件監聽器
andButton.addEventListener('click', function () {
  nextConnector = ' & ';
  saveState();
});

// 「或」按鈕事件監聽器
orButton.addEventListener('click', function () {
  nextConnector = ' | ';
  saveState();
});

// 「清除」按鈕事件監聽器
clearButton.addEventListener('click', function () {
  textToCopyContent = initialDefaultText;
  nextConnector = null;
  isNotActive = false;
  updateDisplayTextBox();
  localStorage.removeItem('copyflow_text');
  localStorage.removeItem('copyflow_connector');
  localStorage.removeItem('copyflow_not');
});

// ── 親密度 Modal ──────────────────────────────────────────────────────────
const intimacyButton = document.getElementById('intimacyButton');
const intimacyModalOverlay = document.getElementById('intimacy-modal-overlay');
const intimacyPreview = document.getElementById('intimacy-preview');
const keypadBackspace = document.getElementById('keypad-backspace');
const keypadCancel = document.getElementById('keypad-cancel');
const keypadConfirm = document.getElementById('keypad-confirm');

let intimacyInput = '';

function updateIntimacyPreview() {
  if (intimacyInput === '') {
    intimacyPreview.textContent = '（請輸入數字）';
    intimacyPreview.classList.add('is-empty');
  } else {
    intimacyPreview.textContent = intimacyInput + '*';
    intimacyPreview.classList.remove('is-empty');
  }
}

function openIntimacyModal() {
  intimacyInput = '';
  updateIntimacyPreview();
  intimacyModalOverlay.style.display = 'flex';
}

function closeIntimacyModal() {
  intimacyInput = '';
  intimacyModalOverlay.style.display = 'none';
}

intimacyButton.addEventListener('click', openIntimacyModal);

// Validate and append one character to intimacyInput.
// Returns false (and shakes preview) if the input is not allowed.
function tryInput(char) {
  const lastChar = intimacyInput.slice(-1);
  const hasDash = intimacyInput.includes('-');

  if (char === '-') {
    // Only one dash allowed; must not already end with a dash
    if (hasDash || lastChar === '' || lastChar === '-') return false;
  } else {
    // char is a digit 0-8
    const digit = parseInt(char, 10);
    // Disallow consecutive digits (e.g. "33")
    if (lastChar !== '' && lastChar !== '-') return false;
    // Enforce ascending order: right-side digit must be > left-side digit
    if (hasDash) {
      const leftStr = intimacyInput.split('-')[0];
      if (leftStr !== '' && digit <= parseInt(leftStr, 10)) return false;
    }
  }

  intimacyInput += char;
  updateIntimacyPreview();
  return true;
}

function shakePreview() {
  intimacyPreview.classList.remove('shake');
  // Force reflow to restart animation
  void intimacyPreview.offsetWidth;
  intimacyPreview.classList.add('shake');
}

document.querySelectorAll('.keypad-btn[data-input]').forEach(btn => {
  btn.addEventListener('click', function () {
    if (!tryInput(this.dataset.input)) shakePreview();
  });
});

keypadBackspace.addEventListener('click', function () {
  intimacyInput = intimacyInput.slice(0, -1);
  updateIntimacyPreview();
});

keypadCancel.addEventListener('click', closeIntimacyModal);

keypadConfirm.addEventListener('click', function () {
  if (intimacyInput === '') {
    showToast('請先輸入親密度數值！');
    return;
  }
  const finalText = intimacyInput + '*';
  closeIntimacyModal();
  handleContentButtonClick(finalText);
});

intimacyModalOverlay.addEventListener('click', function (event) {
  if (event.target === intimacyModalOverlay) closeIntimacyModal();
});

document.addEventListener('keydown', function (event) {
  if (intimacyModalOverlay.style.display === 'none') return;
  const key = event.key;
  if (key >= '0' && key <= '8') {
    if (!tryInput(key)) shakePreview();
  } else if (key === '-') {
    if (!tryInput('-')) shakePreview();
  } else if (key === 'Backspace') {
    event.preventDefault();
    intimacyInput = intimacyInput.slice(0, -1);
    updateIntimacyPreview();
  } else if (key === 'Enter') {
    keypadConfirm.click();
  } else if (key === 'Escape') {
    closeIntimacyModal();
  }
});

// 「複製內容到剪貼簿」按鈕事件監聽器
copyButton.addEventListener('click', function () {
  // 檢查內容是否為空或僅包含空白
  if (!textToCopyContent || textToCopyContent.trim() === "") {
    showToast('沒有內容可以複製！');
    return; // 不執行後續的複製操作
  }

  navigator.clipboard.writeText(textToCopyContent)
    .then(() => {
      showToast('內容 「' + textToCopyContent + '」 已成功複製到剪貼簿！');
    })
    .catch(err => {
      console.error('無法複製文字: ', err);
      showToast('複製失敗。請檢查主控台以獲取更多資訊。');
    });
});