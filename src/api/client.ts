import { Courses } from './courses'
import type { Person } from './person'

interface ApiMethods {
	loadCourses: (department: string) => (cb: (course: string[]) => void) => Promise<unknown>
	loadPeople: () => (cb: (storage: any) => void) => Promise<unknown>
	savePeople: (people: Person[]) => Promise<{
		success: boolean
	}>
}

export const apiClient: ApiMethods = {
	loadCourses: department => cb =>
		new Promise(resolve => resolve(setTimeout(() => cb(Courses[department]), 1000))),
	loadPeople: () => cb =>
		new Promise(resolve =>
			resolve(
				setTimeout(() => cb(JSON.parse(localStorage.people || '[]')), Math.random() * 1000)
			)
		),
	savePeople: people => {
		return new Promise(resolve => {
			setTimeout(() => {
				localStorage.people = JSON.stringify(people)
				return resolve({ success: true })
			}, between(3500, 4500))
		})
	}
}

function between(min: number, max: number): number {
	return Math.random() * (max - min) + min
}
