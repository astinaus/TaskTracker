const addTask = document.querySelectorAll('#add-task');
const inpModal = document.querySelector('#inp-modal');
const detailModal = document.querySelector('#detail-modal');
const tagInput = document.querySelector('#tag-input');
const dateInput = document.querySelector('#date-input');
const txtInput = document.querySelector('.txt-input');
const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const closeBtn = document.querySelector('.close-btn');

const backlog = document.querySelector('#backlog').parentNode;
const ready = document.querySelector('#ready').parentNode;
const doing = document.querySelector('#doing').parentNode;
const review = document.querySelector('#review').parentNode;

const counts = document.querySelectorAll('.num');

dateInput.value = new Date().toISOString().substring(0, 10);

addTask.forEach((item) => {
  item.addEventListener('click', () => {
    inpModal.classList.toggle('active');
    inpModal.id = item.parentNode.id;
  });
});

const dateFunc = (date) => {
  const dateVal = new Date(date);
  const dateNum = dateVal.getDate();
  const day = dateVal.getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dateNum + ' ' + days[day];
};

const createTask = (tagVal, dateVal, txtVal) => {
  const fragment = document.createDocumentFragment();
  const tag = document.createElement('span');
  tag.classList.add('tag');
  switch (tagVal) {
    case 'Youtube':
      tag.id = 'red';
      break;
    case 'Dev':
      tag.id = 'green';
      break;
    case 'Design':
      tag.id = 'yellow';
      break;
  }
  tag.textContent = tagVal;

  const p = document.createElement('p');
  p.textContent = txtVal;

  const boxFooter = document.createElement('div');
  boxFooter.classList.add('box-footer');

  const date = document.createElement('div');
  const li = document.createElement('li');
  const i = document.createElement('i');
  const dateSpan = document.createElement('span');
  date.classList.add('date');
  li.classList.add('fa-solid', 'fa-calendar-days');
  dateSpan.textContent = dateVal;
  li.appendChild(i);
  date.appendChild(li);
  date.appendChild(dateSpan);
  boxFooter.appendChild(date);

  const comment = document.createElement('li');
  const commentI = document.createElement('i');
  comment.classList.add('comment');
  commentI.classList.add('fa-solid', 'fa-message');
  comment.appendChild(commentI);
  comment.appendChild(document.createTextNode('0'));
  boxFooter.appendChild(comment);

  fragment.appendChild(tag);
  fragment.appendChild(p);
  fragment.appendChild(boxFooter);

  return fragment;
};

const loadTask = (tagVal, dateVal, txtVal, category, id) => {
  const box = document.createElement('div');
  box.id = id;
  box.classList.add('box');
  box.appendChild(createTask(tagVal, dateVal, txtVal));
  box.addEventListener('click', () => {
    detailModal.classList.toggle('active');
    detailModal.appendChild(taskDetail(tagVal, dateVal, txtVal, id));
  });
  switch (category) {
    case 'backlog':
      backlog.appendChild(box);
      break;
    case 'ready':
      ready.appendChild(box);
      break;
    case 'doing':
      doing.appendChild(box);
      break;
    case 'review':
      review.appendChild(box);
      break;
  }
};

const saveTask = (tagVal, dateVal, txtVal, category, id) => {
  const task = JSON.parse(localStorage.getItem('task'));
  if (task) {
    task.push({ tagVal, dateVal, txtVal, category, id });
    localStorage.setItem('task', JSON.stringify(task));
  } else {
    localStorage.setItem(
      'task',
      JSON.stringify([{ tagVal, dateVal, txtVal, category, id }])
    );
  }
};

const setCount = () => {
  counts.forEach((item) => {
    const count = JSON.parse(localStorage.getItem('task')).filter(
      (el) => el.category === item.parentNode.parentNode.id
    ).length;
    item.textContent = count;
  });
};

const addTaskFunc = (e) => {
  const category = e.target.parentNode.parentNode.parentNode.id;
  const tagVal = tagInput.value;
  const dateVal = dateFunc(dateInput.value);
  const txtVal = txtInput.value;
  const id = JSON.parse(localStorage.getItem('task')).length;

  if (tagVal === '' || dateVal === '' || txtVal === '') {
    return alert('Please fill all the fields');
  } else {
    loadTask(tagVal, dateVal, txtVal, category, id);
    saveTask(tagVal, dateVal, txtVal, category, id);
  }

  setCount();

  txtInput.value = '';

  inpModal.classList.toggle('active');
};

const deleteTask = (id) => {
  confirm('정말 삭제하시겠습니까?');
  if (!confirm) return;
  const task = JSON.parse(localStorage.getItem('task'));
  const newTask = task.filter((item) => item.id !== id);
  localStorage.setItem('task', JSON.stringify(newTask));
  detailModal.classList.toggle('active');
  detailModal.removeChild(detailModal.childNodes[0]);
  alert('삭제되었습니다.');
  location.reload();
};

const onLoad = () => {
  const task = JSON.parse(localStorage.getItem('task'));
  !task ? localStorage.setItem('task', JSON.stringify([])) : task;
  if (task) {
    task.forEach((item) => {
      loadTask(item.tagVal, item.dateVal, item.txtVal, item.category, item.id);
    });

    setCount();
  }
};

onLoad();

cancelBtn.addEventListener('click', () => {
  inpModal.classList.toggle('active');
  inpModal.id = '';
});

addBtn.addEventListener('click', (e) => {
  addTaskFunc(e);
});

const taskDetail = (tagVal, dateVal, txtVal, id) => {
  const detail = document.createElement('div');
  detail.classList.add('modal', 'detail');

  detail.appendChild(createTask(tagVal, dateVal, txtVal));

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = '삭제';

  deleteBtn.addEventListener('click', () => {
    deleteTask(id);
  });

  detail.appendChild(deleteBtn);

  const btn = document.createElement('span');
  const closeI = document.createElement('i');
  btn.classList.add('close-btn');
  closeI.classList.add('fa-solid', 'fa-xmark');
  btn.addEventListener('click', () => {
    detailModal.classList.toggle('active');
    detailModal.removeChild(detail);
  });
  btn.appendChild(closeI);

  detail.appendChild(btn);

  return detail;
};

onLoad();
