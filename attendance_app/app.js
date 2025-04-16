// Firebase 配置（替换为你的配置）
const firebaseConfig = {
  apiKey: "AIzaSyCvKV57DK9U3HJSeFLQvrs0fBLqzTHhQIk",
  authDomain: "class-kaoqin.firebaseapp.com",
  databaseURL: "https://class-kaoqin-default-rtdb.firebaseio.com",
  projectId: "class-kaoqin",
  storageBucket: "class-kaoqin.firebasestorage.app",
  messagingSenderId: "219963621759",
  appId: "1:219963621759:web:0036293395ca2c874cda4a",
  measurementId: "G-Q6CQMX42Y5"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 实时更新考勤人数
database.ref('attendance').on('value', (snapshot) => {
    const count = snapshot.numChildren();
    document.getElementById('attendanceCount').textContent = count;
});

function checkAttendance() {
    const name = document.getElementById('nameInput').value.trim();
    const resultDiv = document.getElementById('resultMessage');
    
    if (!name) {
        showMessage("请输入姓名！", "error");
        return;
    }

    // 查询数据库
    database.ref('studentList').orderByChild('name').equalTo(name).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                // 记录考勤时间
                const attendanceRef = database.ref('attendance').push();
                attendanceRef.set({
                    name: name,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                showMessage("考勤成功！🎉", "success");
                document.getElementById('nameInput').value = '';
            } else {
                showMessage("姓名不存在，请重试！", "error");
            }
        })
        .catch((error) => {
            showMessage("网络错误，请稍后重试", "error");
        });
}

function showMessage(text, type) {
    const resultDiv = document.getElementById('resultMessage');
    resultDiv.textContent = text;
    resultDiv.className = type;
    resultDiv.style.animation = 'fadeIn 0.5s';
}

console.log("正在查询姓名：", name);
database.ref('studentList').once('value').then((snapshot) => {
  console.log("数据库中的学生名单：", snapshot.val());
});