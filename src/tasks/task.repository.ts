import { Injectable } from '@nestjs/common'
import {
  DataSource,
  // EntityRepository,
  Repository
} from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager())
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` }
      )
    }

    const tasks = await query.getMany()

    return tasks
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto

    // creates the object
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN
    })

    // save to database
    await this.save(task)

    return task
  }
}

// old way
// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> {}
