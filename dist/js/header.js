import Functions from "./func.js"
export default class Header extends Functions {
	constructor(innerTitle) {
		super()
		this.el = this.render(innerTitle)
	}
	changeTile(newInner) {
		this.title.innerText = newInner
	}
	putElementIn(parent) {
		parent.append(this.el)
		return this.el
	}
	render(innerTitle) {
		const header = this.createHtmlElement("header", "header")
		this.title = this.createHtmlElement("h1", "header__title", null, innerTitle)
		header.append(this.title)
		return header
	}
}
