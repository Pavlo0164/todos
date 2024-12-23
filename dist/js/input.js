import Header from "./header.js"
export default class Input extends Header {
	constructor() {
		super()
		this.el = this.render()
	}
	changeActiveClass() {
		this.inputArrow.classList.remove("active-arrow")
	}
	eventInputArrow(e) {
		e.target.classList.toggle("active-arrow")
		let isHaveActiveClass = e.target.classList.contains("active-arrow")
		this.el.dispatchEvent(
			new CustomEvent("switchStatusOfTask", {
				bubbles: true,
				detail: {
					statusOfTasks: isHaveActiveClass ? "inactive" : "active",
					isActiveArrowTasks: isHaveActiveClass,
				},
			})
		)
	}
	eventCreateTask(e) {
		e.preventDefault()
		const { task } = Object.fromEntries(new FormData(e.target).entries())
		if (task !== "") {
			this.input.dispatchEvent(
				new CustomEvent("createTask", {
					bubbles: true,
					detail: {
						taskValue: task,
					},
				})
			)
			this.input.value = ""
		}
	}
	createInput() {
		this.input = this.createHtmlElement("input", "main__input", {
			placeholder: "What needs to be done?",
			name: "task",
			required: "",
			autofocus: "",
			type: "text",
		})
		return this.input
	}
	createInputArrow() {
		this.inputArrow = this.createHtmlElement("span", "main__input-arrow")
		this.inputArrow.addEventListener("click", this.eventInputArrow.bind(this))
		return this.inputArrow
	}
	render() {
		const inputWrapper = this.createHtmlElement("form", "main__input-wrapper", {
			novalidate: "",
			name: "input-task",
		})
		inputWrapper.addEventListener("submit", this.eventCreateTask.bind(this))
		inputWrapper.append(this.createInput(), this.createInputArrow())
		return inputWrapper
	}
}
