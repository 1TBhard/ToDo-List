const tasksInfo = getLocalStorage();

// 로컬 스토리지에서 get
function getLocalStorage() {
  // string 데이터를 JSON.parse() 로 객체화
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// 로컬 스토리지에서 set
function setLocalStorage() {
  // JSON.stringify() 로 객체를 string으로 변환
  // 및 로컬스토리지에 저장
  localStorage.setItem('tasks' , JSON.stringify(tasksInfo));
}

// 테스크 완료해서 .done 으로 토글할 경우
function toggleDone(i) {
  if(tasksInfo[i].class_list.includes('done'))
    tasksInfo[i].class_list = tasksInfo[i].class_list.replace('done', '').trim();
  else
    tasksInfo[i].class_list += ' done';

  reDraw();
  caculateLeftWork();
  setLocalStorage();
}

// 테스크 edit 할 경우(edit 중)
function editTask(i) {
  const parent = document.querySelectorAll('.todo-list li')[i];

  parent.classList.toggle('editable');

  const btn = parent.querySelector('[name="edit"]');

  console.log('edit 버튼 클릭');
  // 수정 중
  if(parent.classList.contains('editable')) {
    btn.textContent = 'Save';
  } else {  // 수정 완료(저장)
    console.log('edit 완료');
    tasksInfo[i].letter = parent.querySelector('input').value;
    btn.textContent = 'Edit';
    reDraw();
  }
}

// 테스크 지우는 경우
function deleteTask(i) {
  tasksInfo.splice(i, 1);
  
  reDraw();
  setLocalStorage();
}

function caculateLeftWork() {
  const taskCount = document.getElementById('task-count');
  // 남은 작업수
  const leftWork = tasksInfo.length - tasksInfo.filter(t => t.class_list == 'done').length;

  taskCount.textContent = `${leftWork} of ${tasksInfo.length} tasks left`;
}

// 다시 todo 리스트를 재설정한다.
function reDraw() {
  console.log(tasksInfo)
  document.querySelector('.todo-list ul').innerHTML= tasksInfo.map(t => {
      return `<li class=${t.class_list}>
          <div class="letter" disabled />${t.letter}</div>
          <input value="${t.letter}" />
          <div class="btn-wrapper">
            <span><button name="done">${t.class_list.includes('done') ? 'Done' : 'UnDone'}</button></span>
            <span><button name="edit">Edit</button></span>
            <span><button name="delete">Delete</button></span>
          </div>
      </li>`
    }).join('');
  
  // task 처음 설정을 여기서 함
  const tasks = [...document.querySelectorAll('.todo-list li')] || '';

  tasks.forEach((task, i) => {
    const letter = task.querySelector('.letter');
    const doneBtn = task.querySelector('button[name="done"]');
    const editBtn = task.querySelector('button[name="edit"]');
    const deleteBtn = task.querySelector('button[name="delete"]');
    const letterInput = task.querySelector('input');
  
    letter.addEventListener('click', () => toggleDone(i));
    doneBtn.addEventListener('click', () => toggleDone(i));
    editBtn.addEventListener('click', () => editTask(i));
    deleteBtn.addEventListener('click', () => deleteTask(i));
    letterInput.addEventListener('keydown', (e) => {
      if(e.keyCode == 13) // 엔터 누른 경우
        editTask(i);
    });
  });

  caculateLeftWork();
}


function addTask(e) {
  e.preventDefault();

  // 아무것도 입력되지 않은 상태에서 엔터 누를 때
  if(this.userInput.value === '') {
    return;
  }

  const n_data = {
    'letter': this.userInput.value,
    'class_list': '',
    'date': Date.now()
  };

  tasksInfo.push(n_data);
  reDraw();
  this.reset();
  setLocalStorage();
}

document.querySelector('form').addEventListener('submit', addTask);

reDraw();

