import Core from '../api/core.json'
import Electives from '../api/electives.json'

interface Course {
	core: typeof Core
	electives: typeof Electives
}

export const Courses: Course = {
	core: Core,
	electives: Electives
}
