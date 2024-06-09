const apiUrl = 'https://<891377097782>.execute-api.us-east-1.amazonaws.com/prod/tasks';

// Fetch tasks from the API
async function fetchTasks(filter = 'all') {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter === 'all' || (filter === 'pending' && task.status === 'pending') || (filter === 'completed' && task.status === 'completed')) {
            const listItem = document.createElement('li');
            listItem.className = task.status === 'completed' ? 'completed' : '';
            listItem.innerHTML = `
                <span class="task-text">${index + 1}. ${task.task}</span>
                <div class="task-buttons">
                    <button onclick="toggleTaskStatus('${task.id}', '${task.status}')">${task.status === 'pending' ? 'Complete' : 'Undo'}</button>
                    <button onclick="editTask('${task.id}', '${task.task}')">Edit</button>
                    <button onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        }
    });
}

// Add a new task using the API
async function addTask(task) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    fetchTasks();
}

// Toggle task status between pending and completed using the API
async function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId, status: newStatus })
    });
    fetchTasks();
}

// Edit an existing task using the API
async function editTask(taskId, currentTask) {
    const newTask = prompt("Edit the task:", currentTask);
    if (newTask !== null) {
        await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: taskId, task: newTask })
        });
        fetchTasks();
    }
}

// Delete a task using the API
async function deleteTask(taskId) {
    await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId })
    });
    fetchTasks();
}

// Event listener for adding a new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task');
    const newTask = { id: Date.now().toString(), task: taskInput.value, status: 'pending' };
    await addTask(newTask);
    taskInput.value = '';
});

// Event listeners for filtering tasks
document.getElementById('filterAll').addEventListener('click', () => fetchTasks('all'));
document.getElementById('filterPending').addEventListener('click', () => fetchTasks('pending'));
document.getElementById('filterCompleted').addEventListener('click', () => fetchTasks('completed'));

// Initial fetch of tasks
fetchTasks();
