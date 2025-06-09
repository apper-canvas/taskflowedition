import tasksData from '../mockData/tasks.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      category: taskData.category,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(250);
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[taskIndex] };
  }

  async delete(id) {
    await delay(300);
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await delay(250);
    return this.tasks.filter(task => task.category === categoryId);
  }

  async getCompleted() {
    await delay(250);
    return this.tasks.filter(task => task.completed && !task.archived);
  }

  async getActive() {
    await delay(250);
    return this.tasks.filter(task => !task.completed && !task.archived);
  }

  async getArchived() {
    await delay(250);
    return this.tasks.filter(task => task.archived);
  }
}

export default new TaskService();