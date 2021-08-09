import Core from './core.json'
import Electives from './electives.json'

interface Course {
	core: typeof Core
	electives: typeof Electives
}

export const Courses: Course = {
	core: Core,
	electives: Electives
}
