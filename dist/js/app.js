import Header from "./header.js"
import Functions from "./func.js"
import Input from "./input.js"
import Task from "./task.js"
class App extends Functions {
	constructor() {
		super()
		this.tasks = JSON.parse(sessionStorage.getItem("tasks")) || []
		this.isActiveArrow = false
		this.el = this.render()
	}
	reshowTasks() {
		Array.from(this.tasksWrapper.children).forEach((el) => el.remove())
		this.tasks.forEach((task) =>
			new Task(task.taskValue, task.checkBoxId, task.status).putElementIn(
				this.tasksWrapper
			)
		)
	}
	deleteTask(e) {
		this.tasks = this.tasks.filter(
			(task) => task.checkBoxId !== e.detail.taskId
		)
		sessionStorage.setItem("tasks", JSON.stringify(this.tasks))
		this.reshowTasks()
	}
	createTask(e) {
		this.tasks.push({
			status: "active",
			taskValue: e.detail.taskValue,
			checkBoxId: this.tasks.length + 1,
		})
		sessionStorage.setItem("tasks", JSON.stringify(this.tasks))
		this.reshowTasks()
	}
	switchStatusOfTasks(e) {
		const { statusOfTasks, isActiveArrowTasks } = e.detail
		this.tasks.forEach((task) => (task.status = statusOfTasks))
		sessionStorage.setItem("tasks", JSON.stringify(this.tasks))
		this.isActiveArrow = isActiveArrowTasks
		this.reshowTasks()
	}
	createMain() {
		this.main = this.createHtmlElement("main", "main")

		this.input = new Input()
		this.input.putElementIn(this.main)
		this.tasksWrapper = this.createHtmlElement("ul", "main__tasks-wrapper")

		this.main.append(this.tasksWrapper)
		return this.main
	}
	changeStatusTask(e) {
		const { taskId, newStatus } = e.detail
		this.tasks.forEach((task) => {
			if (task.checkBoxId === taskId) task.status = newStatus
		})
		if (this.isActiveArrow) this.input.changeActiveClass()
		sessionStorage.setItem("tasks", JSON.stringify(this.tasks))
		this.reshowTasks()
	}
	render() {
		const wrapper = this.createHtmlElement("div", "wrapper")

		wrapper.addEventListener("createTask", this.createTask.bind(this))
		wrapper.addEventListener("deleteTask", this.deleteTask.bind(this))
		wrapper.addEventListener(
			"switchStatusOfTask",
			this.switchStatusOfTasks.bind(this)
		)
		wrapper.addEventListener(
			"changeTaskStatus",
			this.changeStatusTask.bind(this)
		)
		this.header = new Header("todos").putElementIn(wrapper)

		wrapper.append(this.createMain())
		this.reshowTasks()
		return wrapper
	}
}

const app = new App()

document.body.prepend(app.el)
