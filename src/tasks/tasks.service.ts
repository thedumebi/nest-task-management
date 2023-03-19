import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TasksRepository } from './task.repository'
// import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  // old way
  // constructor(
  //   @InjectRepository(Task) private readonly tasksRepository: TasksRepository
  // ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto)
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id })

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }

    return found
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto)
  }

  async deleteTask(id: string): Promise<void> {
    /**
     * with remove method you have to pass in an entity
     * so it involves 2 db calls i.e. fetching and then removing
     * with delete you have one less call to the database. You don't have to pass in an entity just an id
     */
    // const found = await this.getTaskById(id)
    // await this.tasksRepository.remove(found)
    const result = await this.tasksRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id)

    task.status = status
    this.tasksRepository.save(task)

    return task
  }
}
