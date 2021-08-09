import React, { useEffect, useState } from 'react'
import isEmail from 'validator/lib/isEmail'
import type { Person } from './api/person'
import { apiClient } from './api/client'
import Field from './08-field-component-field'
import CourseSelect from './09-course-select'

const content = document.createElement('div')
document.body.appendChild(content)

interface FormFields {
	fields: {
		name: string
		email: string
		course: string | null
		department: string | null
	}
	fieldErrors: Record<string, unknown>
	people: Person[]
	loading: boolean
	saveStatus: 'READY' | 'SUCCESS' | 'ERROR' | 'SAVING'
}

export const RemotePersist = () => {
	const [state, setState] = useState<FormFields>({
		fields: {
			name: '',
			email: '',
			course: null,
			department: null
		},
		fieldErrors: {},
		people: [],
		loading: false,
		saveStatus: 'READY'
	})

	useEffect(() => {
		setState({ ...state, loading: true })
		apiClient.loadPeople()(people => {
			setState({ ...state, loading: false, people })
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const validate = () => {
		const person = state.fields
		const { fieldErrors } = state
		const errMessages = Object.keys(fieldErrors).filter(k => fieldErrors[k])

		const { name, email, course, department } = person

		if (!name) return true
		if (!email) return true
		if (!course) return true
		if (!department) return true
		if (errMessages.length) return true

		return false
	}

	const onFormSubmit = e => {
		e.preventDefault()

		const person = state.fields
		if (validate()) return

		const people = [...state.people, person]

		setState({ ...state, saveStatus: 'SAVING' })

		apiClient
			.savePeople(people)
			.then(() => {
				setState({
					...state,
					people,
					fields: {
						name: '',
						email: '',
						course: null,
						department: null
					},
					saveStatus: 'SUCCESS'
				})
			})
			.catch(err => {
				console.error(err)
				setState({ ...state, saveStatus: 'ERROR' })
			})
	}

	const onInputChange = ({ name, value }) => {
		const { fields, fieldErrors } = state

		fields[name] = value

		setState({ ...state, fields, fieldErrors, saveStatus: 'READY' })
	}

	if (state.loading) {
		return <img alt="loading" src="/img/loading.gif" />
	}

	return (
		<div>
			<h1>Sign Up Sheet</h1>

			<form onSubmit={onFormSubmit}>
				<Field
					placeholder="Name"
					name="name"
					value={state.fields.name}
					onChange={onInputChange}
					validate={val => (val ? false : 'Name Required')}
				/>

				<br />

				<Field
					placeholder="Email"
					name="email"
					value={state.fields.email}
					onChange={onInputChange}
					validate={val => !isEmail(val) && 'Invalid Email'}
				/>

				<br />

				<CourseSelect
					department={state.fields.department ?? ''}
					// course={state.fields.course ?? ''}
					onChange={onInputChange}
				/>

				<br />

				{
					{
						SAVING: <input value="Saving..." type="submit" disabled />,
						SUCCESS: <input value="Saved!" type="submit" disabled />,
						ERROR: (
							<input value="Save Failed - Retry?" type="submit" disabled={validate()} />
						),
						READY: <input value="Submit" type="submit" disabled={validate()} />
					}[state.saveStatus]
				}
			</form>

			<div>
				<h3>People</h3>
				<ul>
					{state.people.map(({ name, email, department, course }, i) => (
						<li key={i}>{[name, email, department, course].join(' - ')}</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default RemotePersist
