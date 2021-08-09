interface ApiMethods {
	loadPeople: () => {
		then: (cb: (storage: any) => void) => any
	}
	savePeople: (people: Record<string, unknown>) => Promise<{
		success: boolean
	}>
}

export const methods: ApiMethods = {
	loadPeople: () => ({
		then: cb => {
			setTimeout(() => cb(JSON.parse(localStorage.people || '[]')), Math.random() * 1000)
		}
	}),

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
