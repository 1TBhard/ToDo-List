const tasksInfo = getLocalStorage();

// 로컬 스토리지에서 get
function getLocalStorage() {
  // string 데이터를 JSON.parse() 로 객체화
  return JSON.parse(localStorage.getItem('tasks'));
}

// 로컬 스토리지에서 set
function setLocalStorage() {
  // JSON.stringify() 로 객체를 string으로 변환
  // 및 로컬스토리지에 저장
  localStorage.setItem('tasks' , JSON.stringify(tasksInfo));
}

// 테스크 완료해서 .done 으로 토글할 경우
function toggleDone() {
  const parentLi = this.parentElement;
  console.log(this.parentElement);
  
  parentLi.classList.toggle('done');

  if(parentLi.classList.contains('done'))
    parentLi.querySelector('[name="done"]').textContent = 'Done';
  else
    parentLi.querySelector('[name="done"]').textContent = 'UnDone';
  
  caculateLeftWork();
  setLocalStorage();
}

// 테스크 edit 할 경우
function editTask(i) {
  // this.parentElement.classList.toggle('done');
  caculateLeftWork();
  setLocalStorage();
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
  document.querySelector('.todo-list ul').innerHTML= tasksInfo.map(t => {
      return `<li class=${t.class_list}>
        <div class="letter">${t.letter}</div>
        <div class="btn-wrapper">
          <button name="done">${t.class_list.includes('done') ? 'Done' : 'UnDone'}</button>
          <button name="edit">Edit</button>
          <button name="delete">Delete</button>
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
  
    letter.addEventListener('click', toggleDone);
    doneBtn.addEventListener('click', toggleDone);
    editBtn.addEventListener('click', editTask(i));
    deleteBtn.addEventListener('click', () => deleteTask(i));
  });

  caculateLeftWork();
}


reDraw();

function addTask(e) {
  e.preventDefault();

  const n_data = {
    'letter': this.userInput.value,
    'class_list': '',
    'date': Date.now()
  };

  tasksInfo.push(n_data);
  reDraw();
  this.reset();
}

document.querySelector('form').addEventListener('submit', addTask)