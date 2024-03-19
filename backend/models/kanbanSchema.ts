import mongoose, { Model, Schema } from 'mongoose'
import { ITasks } from '../types/interfaces'

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aeiaykn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((err) => {
    console.log(err)

    console.log('Something went wrong')
  })

const tasksSchema: Schema<ITasks> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['low', 'medium', 'high'],
    },
  },
  { timestamps: true }
)

const TaskModel: Model<ITasks> = mongoose.model<ITasks>('tasks', tasksSchema)

export default TaskModel
