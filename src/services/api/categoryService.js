class CategoryService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
    
    // Define all available fields for fetching (including system/readonly fields)
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'color', 'task_count', 'active_tasks', 'completed_tasks'
    ];
    
    // Define only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'color', 'task_count', 'active_tasks', 'completed_tasks'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.success) {
        console.error(response?.message || 'Failed to fetch categories');
        throw new Error(response?.message || 'Failed to fetch categories');
      }
      
      // Transform the data to match expected format
      const categories = (response.data || []).map(category => ({
        id: category.Id,
        name: category.Name,
        color: category.color,
        taskCount: category.task_count || 0,
        activeTasks: category.active_tasks || 0,
        completedTasks: category.completed_tasks || 0
      }));
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        console.error(response?.message || 'Failed to fetch category');
        throw new Error(response?.message || 'Category not found');
      }
      
      // Transform the data to match expected format
      const category = response.data;
      return {
        id: category.Id,
        name: category.Name,
        color: category.color,
        taskCount: category.task_count || 0,
        activeTasks: category.active_tasks || 0,
        completedTasks: category.completed_tasks || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      // Filter to only include updateable fields and transform field names
      const filteredData = {
        Name: categoryData.name || categoryData.Name,
        color: categoryData.color,
        task_count: categoryData.taskCount || categoryData.task_count || 0,
        active_tasks: categoryData.activeTasks || categoryData.active_tasks || 0,
        completed_tasks: categoryData.completedTasks || categoryData.completed_tasks || 0
      };
      
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
        
        const createdCategory = successfulRecords[0]?.data;
        return {
          id: createdCategory.Id,
          name: createdCategory.Name,
          color: createdCategory.color,
          taskCount: createdCategory.task_count || 0,
          activeTasks: createdCategory.active_tasks || 0,
          completedTasks: createdCategory.completed_tasks || 0
        };
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Filter to only include updateable fields and transform field names
      const filteredUpdates = { Id: parseInt(id) };
      
      if (updates.name || updates.Name) {
        filteredUpdates.Name = updates.name || updates.Name;
      }
      if (updates.color !== undefined) {
        filteredUpdates.color = updates.color;
      }
      if (updates.taskCount !== undefined || updates.task_count !== undefined) {
        filteredUpdates.task_count = updates.taskCount || updates.task_count;
      }
      if (updates.activeTasks !== undefined || updates.active_tasks !== undefined) {
        filteredUpdates.active_tasks = updates.activeTasks || updates.active_tasks;
      }
      if (updates.completedTasks !== undefined || updates.completed_tasks !== undefined) {
        filteredUpdates.completed_tasks = updates.completedTasks || updates.completed_tasks;
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
          throw new Error('Failed to update category');
        }
        
        const updatedCategory = successfulUpdates[0]?.data;
        return {
          id: updatedCategory.Id,
          name: updatedCategory.Name,
          color: updatedCategory.color,
          taskCount: updatedCategory.task_count || 0,
          activeTasks: updatedCategory.active_tasks || 0,
          completedTasks: updatedCategory.completed_tasks || 0
        };
      }
    } catch (error) {
      console.error('Error updating category:', error);
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
          throw new Error('Failed to delete category');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export default new CategoryService();