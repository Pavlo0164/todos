import Header from "./header.js"
export default class Input extends Header {
	constructor() {
		super()
		this.el = this.render()
	}
	eventInputArrow(e) {
		e.target.classList.toggle("active-arrow")

		this.el.dispatchEvent(
			new CustomEvent("switchStatusOfTask", {
				bubbles: true,
				detail: {
					statusOfTasks: e.target.classList.contains("active-arrow")
						? "inactive"
						: "active",
				},
			})
		)
	}
	eventCreateTask(e) {
		if (e.target.value !== "" && e.key === "Enter") {
			this.input.dispatchEvent(
				new CustomEvent("createTask", {
					bubbles: true,
					detail: {
						taskValue: e.target.value,
					},
				})
			)
			e.target.value = ""
		}
	}
	createInput() {
		this.input = this.createHtmlElement("input", "main__input", {
			placeholder: "What needs to be done?",
			name: "task",
			required: "",
			autofocus: "",
		})

		this.input.addEventListener("keydown", this.eventCreateTask.bind(this))
		return this.input
	}
	createInputArrow() {
		const inputArrow = this.createHtmlElement("span", "main__input-arrow")
		inputArrow.addEventListener("click", this.eventInputArrow.bind(this))
		return inputArrow
	}
	render() {
		const inputWrapper = this.createHtmlElement("div", "main__input-wrapper")

		inputWrapper.append(this.createInput(), this.createInputArrow())
		return inputWrapper
	}
}
