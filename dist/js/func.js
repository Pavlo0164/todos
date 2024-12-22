export default class Functions {
	createHtmlElement(type, className = null, attr = null, inner = null) {
		const element = document.createElement(type)
		if (Array.isArray(className))
			className.forEach((el) => element.classList.add(el))
		else if (className) element.classList.add(className)
		if (attr) for (const key in attr) element.setAttribute(key, attr[key])
		if (inner) element.innerText = inner
		return element
	}
}
