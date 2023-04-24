import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import {
  DataSource,
  // EntityRepository,
  Repository
} from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true })

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager())
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')
    query.where({ user })

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` }
      )
    }

    try {
      const tasks = await query.getMany()

      return tasks
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        err.stack
      )
      throw new InternalServerErrorException()
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto

    // creates the object
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    })

    // save to database
    await this.save(task)

    return task
  }
}

// old way
// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> {}
