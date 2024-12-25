import Header from "./header.js"

export default class Task extends Header {
	constructor(innerTask, id, status) {
		super()
		this.checkBoxId = id
		this.status = status
		this.el = this.render(innerTask)
	}

	eventCheckbox(e) {
		if (e.target.checked) this.status = "inactive"
		else this.status = "active"
		this.el.dispatchEvent(
			new CustomEvent("changeTaskStatus", {
				bubbles: true,
				detail: {
					taskId: this.checkBoxId,
					newStatus: this.status,
				},
			})
		)
	}
	lockFunction(e) {
		let countOfClicks = 0
		let timer = null
		return function (e) {
			countOfClicks++
			if (countOfClicks === 1) {
				timer = setTimeout(() => {
					countOfClicks = 0
				}, 300)
			} else if (countOfClicks === 2) {
				clearTimeout(timer)
				countOfClicks = 0
				if (e.target.getAttribute("contenteditable") === "false") {
					e.target.setAttribute("contenteditable", "true")
					e.target.focus()
				}
			}
		}
	}
	createCheckbox() {
		this.checkBoxLabel = this.createHtmlElement(
			"label",
			"task__label-checkbox",
			{ for: `check-box-${this.checkBoxId}` }
		)

		const checkBox = this.createHtmlElement("input", "task__check-box", {
			type: "checkbox",
			id: `check-box-${this.checkBoxId}`,
		})
		if (this.status === "inactive") {
			checkBox.setAttribute("checked", "")
			this.checkBoxLabel.classList.add("inactive")
		}
		this.checkBoxLabel.append(checkBox)
		checkBox.addEventListener("change", this.eventCheckbox.bind(this))
		return this.checkBoxLabel
	}

	createInputTask(innerTask) {
		this.inputTask = this.createHtmlElement(
			"label",
			"task__input",
			{
				contenteditable: "false",
			},
			innerTask
		)
		this.inputTask.addEventListener("click", this.lockFunction.bind(this)())
		return this.inputTask
	}
	eventDeleteTask(e) {
		this.el.dispatchEvent(
			new CustomEvent("deleteTask", {
				bubbles: true,
				detail: {
					taskId: this.checkBoxId,
				},
			})
		)
	}
	createButtonDeleteTask() {
		const close = this.createHtmlElement("span", "task__close")
		close.addEventListener("click", this.eventDeleteTask.bind(this))
		return close
	}
	eventSwitchContenteditable(e) {
		if (
			!e.target.classList.contains("task__input") &&
			this.inputTask.getAttribute("contenteditable") === "true"
		) {
			this.inputTask.setAttribute("contenteditable", "false")
		}
	}
	render(innerTask) {
		const taskWrapper = this.createHtmlElement("li", [
			"main__task-wrapper",
			"task",
		])

		document.body.addEventListener(
			"click",
			this.eventSwitchContenteditable.bind(this)
		)
		taskWrapper.append(
			this.createCheckbox(),
			this.createInputTask(innerTask),
			this.createButtonDeleteTask()
		)
		return taskWrapper
	}
}
