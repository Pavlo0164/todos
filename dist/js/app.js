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
		this.typeOfShowedTasks = "all"
		this.el = this.render()
	}
	reshowTasks(typeOfTasks = "all") {
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
		this.typeOfShowedTasks = typeOfTasks
		this.navigation.changeAmountOfTasks(this.calcAmountOfTasks("active"))
	}

	deleteTask(e) {
		this.tasks = this.tasks.filter(
			(task) => task.checkBoxId !== e.detail.taskId
		)

		this.setTasksToBase("tasks", this.tasks)
		this.reshowTasks(this.typeOfShowedTasks)
	}
	setTasksToBase(name, data) {
		sessionStorage.setItem(name, JSON.stringify(data))
	}
	createTask(e) {
		this.tasks.push({
			status: "active",
			taskValue: e.detail.taskValue,
			checkBoxId: Math.floor(Math.random() * 10000),
		})

		this.setTasksToBase("tasks", this.tasks)
		
		this.reshowTasks(this.typeOfShowedTasks)
	}
	switchStatusOfTasks(e) {
		const { statusOfTasks, isActiveArrowTasks } = e.detail
		this.tasks.forEach((task) => (task.status = statusOfTasks))

		this.setTasksToBase("tasks", this.tasks)
		this.isActiveArrow = isActiveArrowTasks
		this.reshowTasks(this.typeOfShowedTasks)
	}
	calcAmountOfTasks(type) {
		return this.tasks.reduce(
			(amount, el) => (el.status === type ? (amount += 1) : amount),
			0
		)
	}
	createMain() {
		this.main = this.createHtmlElement("main", "main")
		this.input = new Input()
		this.input.putElementIn(this.main)
		this.tasksWrapper = this.createHtmlElement("ul", "main__tasks-wrapper")

		const observer = new MutationObserver(() => {
			const tasks = this.tasksWrapper.children
			if (tasks.length) this.navigation.changeClass("remove")
			else if (!tasks.length && this.typeOfShowedTasks !== "completed") {
				this.navigation.changeClass("add")
			}
		})
		observer.observe(this.tasksWrapper, {
			childList: true,
		})
		const amountOfCompleted = this.calcAmountOfTasks("inactive")
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
		this.setTasksToBase("tasks", this.tasks)
		this.reshowTasks(this.typeOfShowedTasks)

		let isHasUnactive = false
		this.tasks.forEach((el) =>
			el.status === "inactive" ? (isHasUnactive = true) : ""
		)
		this.navigation.changeClassOfButton(isHasUnactive)
	}
	deleteCompletedTasks() {
		this.tasks = this.tasks.filter((el) => el.status === "active")
		this.reshowTasks(this.typeOfShowedTasks)
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

		this.reshowTasks(this.typeOfShowedTasks)
		return wrapper
	}
}

const app = new App()

document.body.prepend(app.el)
