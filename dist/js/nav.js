import Header from "./header.js"
export default class Navigation extends Header {
	constructor(amountOfTasks, amountOfCompleted) {
		super()
		this.el = this.render(amountOfTasks, amountOfCompleted)
	}
	eventActiveMenu(e) {
		const target = e.target
		if (!target.classList.contains("menu__link")) return

		const links = this.el.querySelectorAll(".menu__link")
		Array.from(links).forEach((el) => el.classList.remove("active"))
		target.classList.add("active")

		target.dispatchEvent(
			new CustomEvent("showTasks", {
				bubbles: true,
				detail: {
					typeOfShow: target.getAttribute("data-type-show"),
				},
			})
		)
	}
	createMenu() {
		const menu = this.createHtmlElement("nav", ["navigation__menu", "menu"])
		menu.addEventListener("click", this.eventActiveMenu.bind(this))
		this.itemAllTasks = this.createHtmlElement(
			"a",
			["menu__link", "active"],
			{
				href: "#",
				"data-type-show": "all",
			},
			"All"
		)

		this.itemActiveTasks = this.createHtmlElement(
			"a",
			"menu__link",
			{
				href: "#",
				"data-type-show": "active",
			},
			"Active"
		)

		this.itemCompletedTasks = this.createHtmlElement(
			"a",
			"menu__link",
			{
				href: "#",
				"data-type-show": "completed",
			},
			"Completed"
		)
		menu.append(
			this.itemAllTasks,
			this.itemActiveTasks,
			this.itemCompletedTasks
		)
		return menu
	}

	changeAmountOfTasks(newAmount) {
		this.amountOfTasks.innerText = `${newAmount} ${
			newAmount === 1 ? "item" : "items"
		} left`
	}
	changeClassOfButton(isHasUnactive) {
		if (isHasUnactive)
			this.buttonClearCompletedTasks.classList.remove("unactive")
		else this.buttonClearCompletedTasks.classList.add("unactive")
	}
	eventDeleteCompleted(e) {
		e.target.classList.add("unactive")
		this.el.dispatchEvent(
			new CustomEvent("deleteCompletedTasks", {
				bubbles: true,
			})
		)
	}
	changeClass(type, name = "hidden") {
		switch (type) {
			case "add":
				this.navigation.classList.add(name)
				break
			case "remove":
				this.navigation.classList.remove(name)
		}
	}
	render(amountTasks, amountOfCompleted, amountOfTasks) {
		this.navigation = this.createHtmlElement("div", [
			"main__navigation",
			"navigation",
		])

		this.amountOfTasks = this.createHtmlElement(
			"span",
			"navigation__amount-of-tasks",
			null,
			`${amountTasks} ${amountTasks === 1 ? "item" : "items"} left`
		)

		this.buttonClearCompletedTasks = this.createHtmlElement(
			"button",
			"navigation__button",
			{ type: "button" },
			"Clear completed"
		)
		if (amountOfCompleted === 0)
			this.buttonClearCompletedTasks.classList.add("unactive")
		this.buttonClearCompletedTasks.addEventListener(
			"click",
			this.eventDeleteCompleted.bind(this)
		)
		if (!amountOfTasks) this.changeClass("add")
		this.navigation.append(
			this.amountOfTasks,
			this.createMenu(),
			this.buttonClearCompletedTasks
		)
		return this.navigation
	}
}
