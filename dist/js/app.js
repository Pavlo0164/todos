import Header from "./header.js"
import Functions from "./func.js"
import Input from "./input.js"
import Task from "./task.js"
class App extends Functions {
	constructor() {
		super()
		this.tasks = []
		this.el = this.render()
	}
	reshowTasks() {
		Array.from(this.tasksWrapper.children).forEach((el) => el.remove())
		this.tasks.forEach((task) =>
			new Task(task.taskValue, task.checkBoxId).putElementIn(this.tasksWrapper)
		)
	}
	deleteTask(e) {
		this.tasks = this.tasks.filter(
			(task) => task.checkBoxId !== e.detail.taskId
		)
		this.reshowTasks()
	}
	createTask(e) {
		this.tasks.push({
			status: "active",
			taskValue: e.detail.taskValue,
			checkBoxId: this.tasks.length + 1,
		})
		//new Task(e.detail.taskValue, this.tasks.length + 1)
		sessionStorage.setItem("tasks", JSON.stringify(this.tasks))
		this.reshowTasks()
	}
	switchStatusOfTasks(e) {
		this.tasks.forEach((task) => task.changeStatus(e.detail.statusOfTasks))
	}
	createMain() {
		this.main = this.createHtmlElement("main", "main")

		this.input = new Input().putElementIn(this.main)
		this.tasksWrapper = this.createHtmlElement("div", "main__tasks-wrapper")

		this.main.append(this.tasksWrapper)
		return this.main
	}
	render() {
		const wrapper = this.createHtmlElement("div", "wrapper")

		wrapper.addEventListener("createTask", this.createTask.bind(this))
		wrapper.addEventListener("deleteTask", this.deleteTask.bind(this))
		wrapper.addEventListener(
			"switchStatusOfTask",
			this.switchStatusOfTasks.bind(this)
		)

		this.header = new Header("todos").putElementIn(wrapper)

		wrapper.append(this.createMain())

		return wrapper
	}
}

const app = new App()

document.body.prepend(app.el)
