import {Todo} from "@/models/Todo";

export class TodoApi {
  static baseUrl = 'http://10.0.2.2:3000';

  static async getTodos() {
    const result = await fetch(`${TodoApi.baseUrl}/todos`);
    return (await result.json()) as Todo[];
  }

  static async postTodo(newTodo: Todo) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");


    await fetch(`${TodoApi.baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers,
    });
  }

  static async putTodo(updatedTodo: Todo) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");


    await fetch(`${TodoApi.baseUrl}/todos/${updatedTodo.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTodo),
      headers,
    });
  }
}
