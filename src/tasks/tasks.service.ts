import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TasksRepository } from './tasks.repository'
// import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { User } from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  // old way
  // constructor(
  //   @InjectRepository(Task) private readonly tasksRepository: TasksRepository
  // ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    // const found = await this.tasksRepository.findOneBy({ id })
    const found = await this.tasksRepository.findOne({ where: { id, user } })

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }

    return found
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user)
  }

  async deleteTask(id: string, user: User): Promise<void> {
    /**
     * with remove method you have to pass in an entity
     * so it involves 2 db calls i.e. fetching and then removing
     * with delete you have one less call to the database. You don't have to pass in an entity just an id
     */
    // const found = await this.getTaskById(id)
    // await this.tasksRepository.remove(found)
    const result = await this.tasksRepository.delete({ id, user })

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(id, user)

    task.status = status
    this.tasksRepository.save(task)

    return task
  }
}
