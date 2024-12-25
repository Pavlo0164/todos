import Header from "./header.js"
import Functions from "./func.js"
import Input from "./input.js"
import Task from "./task.js"
import Navigation from "./nav.js"
class App extends Functions {
	constructor() {
		super()
		this.tasks = JSON.parse(sessionStorage.getItem("tasks")) || []
		this.isActiveArrow = false
		this.el = this.render()
	}
	reshowTasks(typeOfTasks) {
		Array.from(this.tasksWrapper.children).forEach((el) => el.remove())
		switch (typeOfTasks) {
			case "active":
				this.tasks.forEach((task) => {
					if (task.status === "active")
						new Task(task.taskValue, task.checkBoxId, task.status).putElementIn(
							this.tasksWrapper
						)
				})
				break
			case "completed":
				this.tasks.forEach((task) => {
					if (task.status === "inactive")
						new Task(task.taskValue, task.checkBoxId, task.status).putElementIn(
							this.tasksWrapper
						)
				})
				break
			default:
				this.tasks.forEach((task) =>
					new Task(task.taskValue, task.checkBoxId, task.status).putElementIn(
						this.tasksWrapper
					)
				)
				break
		}
		const amountTasks = this.tasks.reduce(
			(value, el) => (el.status === "active" ? (value += 1) : value),
			0
		)
		this.navigation.changeAmountOfTasks(amountTasks)
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
		const amountOfCompleted = this.tasks.reduce(
			(amount, el) => (el.status === "inactive" ? (amount += 1) : amount),
			0
		)
		this.navigation = new Navigation(this.tasks.length, amountOfCompleted)
		this.main.append(this.tasksWrapper, this.navigation.el)
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

		let isHasUnactive = false
		this.tasks.forEach((el) =>
			el.status === "inactive" ? (isHasUnactive = true) : ""
		)
		this.navigation.changeClassOfButton(isHasUnactive)
	}
	deleteCompletedTasks() {
		this.tasks = this.tasks.filter((el) => el.status === "active")
		this.reshowTasks()
	}
	eventShowTasks(e) {
		this.reshowTasks(e.detail.typeOfShow)
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
		wrapper.addEventListener(
			"deleteCompletedTasks",
			this.deleteCompletedTasks.bind(this)
		)
		wrapper.addEventListener("showTasks", this.eventShowTasks.bind(this))

		this.header = new Header("todos").putElementIn(wrapper)
		wrapper.append(this.createMain())

		this.reshowTasks()
		return wrapper
	}
}

const app = new App()

document.body.prepend(app.el)
