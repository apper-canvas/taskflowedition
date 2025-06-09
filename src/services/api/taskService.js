class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
    
    // Define all available fields for fetching (including system/readonly fields)
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'updated_at', 'archived'
    ];
    
    // Define only updateable fields for create/update operations
    this.updateableFields = [
      'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'updated_at', 'archived'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.success) {
        console.error(response?.message || 'Failed to fetch tasks');
        throw new Error(response?.message || 'Failed to fetch tasks');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.success) {
        console.error(response?.message || 'Failed to fetch task');
        throw new Error(response?.message || 'Task not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (taskData.hasOwnProperty(field)) {
          filteredData[field] = taskData[field];
        }
      });
      
      // Ensure proper data formatting for Apper backend
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }
      if (filteredData.category && typeof filteredData.category !== 'number') {
        filteredData.category = parseInt(filteredData.category);
      }
      
      const params = {
        records: [filteredData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          throw new Error('Some records failed to create');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields
      const filteredUpdates = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updates.hasOwnProperty(field)) {
          filteredUpdates[field] = updates[field];
        }
      });
      
      // Ensure proper data formatting for Apper backend
      if (filteredUpdates.completed !== undefined) {
        filteredUpdates.completed = Boolean(filteredUpdates.completed);
      }
      if (filteredUpdates.category && typeof filteredUpdates.category !== 'number') {
        filteredUpdates.category = parseInt(filteredUpdates.category);
      }
      
      const params = {
        records: [filteredUpdates]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          throw new Error('Failed to update task');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export default new TaskService();