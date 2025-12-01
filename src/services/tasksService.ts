/**
 * Task Service - Offline Storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
// import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task.types';

class TasksService {
  private STORAGE_KEY = '@tasks_storage_key';

  /**
   * Get all todos from storage
   */
  async getTasks(): Promise<any> {
     try {
      console.log('Fetching tasks from storage', );
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  /**
   * Create new todo
   */
  async createTask(data: any): Promise<any> {
    const tasks = await this.getTasks();

 const newTask = {
      ...data,
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await this.saveTasks(tasks);

    return newTask;
  }

  /**
   * Update existing task
   */
  async updateTask(id: string, data: any): Promise<any | null> {
 const tasks = await this.getTasks();
    const index = tasks.findIndex((task:any) => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: any = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    await this.saveTasks(tasks);

    return updatedTask;
  }

  /**
   * Delete todo
   */
  async deleteTask(id: string): Promise<void> {
     const tasks = await this.getTasks();
    const filtered = tasks.filter((task:any) => task.id !== id);
    await this.saveTasks(filtered);
  }

  /**
   * Clear all tasks
   */
  async clearAllTasks(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }


  /**
   * Private: Save todos to storage
   */
  private async saveTasks(tasks: any[]): Promise<void> {
    try {
      console.log('taskkkkkk', tasks);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving todos:', error);
      throw new Error('Failed to save todos');
    }
  }
}

// Export singleton instance
export const tasksService = new TasksService();


// export const TasksService = {
//   async getTasks(params?: TasksQueryParams): Promise<any[]> {
//     if (API_CONFIG.MOCK_API) {
//       return await mockApi.get<any[]>('/tasks', { params });
//     }
//     return await api.get<any[]>('/tasks', { params });
//   },

//   async createTask(data: any): Promise<any> {
//     if (API_CONFIG.MOCK_API) {
//       // Mock API akan handle id, stockPhysical, timestamps
//       return await mockApi.post<any>('/tasks', data);
//     }

//     // Real API mungkin butuh data lengkap
//     const newProduct = {
//       ...data,
//       id: Date.now().toString(),
//       title: data.title,
//       description: data.description,
//       status: data.status,
//       priority: data.priority,
//       dueDate: data.dueDate,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };
//     return await api.post<any>('/tasks', newProduct);
//   },

//   async updateTask(data: any): Promise<any> {
//     if (API_CONFIG.MOCK_API) {
//       // Mock API akan handle updatedAt
//       return await mockApi.put<any>(`/tasks/${data.id}`, data);
//     }

//     const updateData = {
//       ...data,
//       updatedAt: new Date().toISOString()
//     };
//     return await api.put<any>(`/tasks/${data.id}`, updateData);
//   },

//   async deleteTask(id: string): Promise<void> {
//     if (API_CONFIG.MOCK_API) {
//       await mockApi.delete(`/tasks/${id}`);
//       return;
//     }
//     await api.delete(`/tasks/${id}`);
//   },
// }