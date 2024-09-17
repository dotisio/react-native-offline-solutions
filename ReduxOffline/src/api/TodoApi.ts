import {Todo} from '../models/Todo.ts';

export class TodoApi {
  static baseUrl = 'http://10.0.2.2:3000';

  static async getTodos() {
    const result = await fetch(`${TodoApi.baseUrl}/todos`);
    return (await result.json()) as Todo[];
  }

  static async postTodo(newTodo: Todo) {
    await fetch(`${TodoApi.baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(newTodo),
    });
  }
}
