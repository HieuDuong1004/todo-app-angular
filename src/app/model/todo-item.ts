import { TodoCategory } from "./todo-caterory";

export class TodoItem {
    constructor(public id: number, public label: string, public description: string,
        public category: TodoCategory, public isCompleted: boolean,
        public isHidden?: boolean) {
    }
}
