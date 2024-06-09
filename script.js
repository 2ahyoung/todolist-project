const apiUrl = 'https://<your-api-id>.execute-api.us-east-1.amazonaws.com/prod/tasks';

async function fetchTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.task;
        taskList.appendChild(listItem);
    });
}

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task');
    const newTask = { id: Date.now().toString(), task: taskInput.value, status: 'pending' };
    await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(newTask)
    });
    taskInput.value = '';
    fetchTasks();
});

fetchTasks();
