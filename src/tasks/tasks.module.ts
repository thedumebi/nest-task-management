import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { TasksRepository } from './tasks.repository'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  // old way
  // imports: [TypeOrmModule.forFeature([TasksRepository])],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository]
})
export class TasksModule {}
