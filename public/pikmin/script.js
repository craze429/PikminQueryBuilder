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

// 更新顯示文字框內容
function updateDisplayTextBox() {
  displayTextbox.value = textToCopyContent;
}

// 顯示浮動通知
function showToast(message) {
  if (!toastNotification) return; // 如果通知元素不存在，則不執行

  toastNotification.textContent = message;
  toastNotification.style.display = 'block'; // 顯示通知
  toastNotification.classList.add('show'); // 觸發顯示動畫

  // 設定一段時間後隱藏通知
  setTimeout(() => {
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
}

// 初始化時更新顯示文字框
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
});

// 「並且」按鈕事件監聽器
andButton.addEventListener('click', function () {
  nextConnector = ' & ';
});

// 「或」按鈕事件監聽器
orButton.addEventListener('click', function () {
  nextConnector = ' | ';
});

// 「清除」按鈕事件監聽器
clearButton.addEventListener('click', function () {
  textToCopyContent = initialDefaultText;
  nextConnector = null;
  isNotActive = false;
  updateDisplayTextBox();
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