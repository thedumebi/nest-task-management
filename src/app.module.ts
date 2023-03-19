import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ABcd12..',
      database: 'task_management',
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    })
  ]
})
export class AppModule {}
