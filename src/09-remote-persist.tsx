import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Field from '08-field-component-field'
import type { Person } from './api/person'
import { apiClient } from './api/client'

const content = document.createElement('div')
document.body.appendChild(content)

interface StateFields {
	people: Person[]
	courses: string[]
	loading: boolean
	saveStatus: 'READY' | 'SUCCESS' | 'ERROR' | 'SAVING'
}

interface FormFields {
	name: string
	email: string
	course: string
	department: string
}

const schema = yup.object().shape({
	name: yup.string().required(),
	email: yup.string().required().email(),
	course: yup.string(),
	department: yup.string()
})

export const RemotePersist = () => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isValid }
	} = useForm<FormFields>({
		resolver: yupResolver(schema),
		mode: 'onChange'
	})
	const [state, setState] = useState<StateFields>({
		people: [],
		courses: [],
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

	const fetchCourses = async (department: string) => {
		setState({ ...state, loading: true, courses: [] })

		await apiClient.loadCourses(department)(courses => {
			setState({ ...state, loading: false, courses })
		})
	}

	const onFormSubmit = async (person: Person) => {
		if (!(await schema.isValid(person))) return

		const people = [...state.people, person]

		setState({ ...state, saveStatus: 'SAVING' })

		apiClient
			.savePeople(people)
			.then(() => {
				setState({
					...state,
					people,
					saveStatus: 'SUCCESS'
				})

				reset()
			})
			.catch(err => {
				console.error(err)
				setState({ ...state, saveStatus: 'ERROR' })
			})
	}

	const name = register('name', { required: true })
	const email = register('email', { required: true })
	const department = register('department', { required: true })
	const course = register('course', { required: true })

	return (
		<div>
			<h1>Sign Up Sheet</h1>

			<form onSubmit={handleSubmit(onFormSubmit)}>
				<Field
					{...name}
					onChange={e => {
						name.onChange(e)
						setState({ ...state, saveStatus: 'READY' })
					}}
					placeholder="Enter a name..."
					errorMessage={errors.name && 'Name Required'}
				/>
				<br />
				<Field
					{...email}
					onChange={e => {
						email.onChange(e)
						setState({ ...state, saveStatus: 'READY' })
					}}
					placeholder="Enter an email..."
					errorMessage={errors.email && 'Invalid Email'}
				/>
				<br />
				<div>
					<select
						{...department}
						onChange={async e => {
							const departmentValue = e.target.value
							department.onChange(e)
							setValue('course', '')
							setState({ ...state, saveStatus: 'READY' })

							if (departmentValue) await fetchCourses(departmentValue)
						}}
					>
						<option value="">Which department?</option>
						<option value="core">NodeSchool: Core</option>
						<option value="electives">NodeSchool: Electives</option>
					</select>
					<br />
					<br />
					{state.loading ? (
						<img alt="loading" src="/img/loading.gif" />
					) : !watch('department') || !state.courses?.length ? (
						<span />
					) : (
						<select {...course} name="course">
							{[
								<option value="" key="course-none">
									Which course?
								</option>,

								...state.courses.map((course, i) => (
									<option value={course} key={i}>
										{course}
									</option>
								))
							]}
						</select>
					)}
				</div>
				<br />
				{
					{
						SAVING: <input value="Saving..." type="submit" disabled />,
						SUCCESS: <input value="Saved!" type="submit" disabled />,
						ERROR: <input value="Save Failed - Retry?" type="submit" disabled={!isValid} />,
						READY: <input value="Submit" type="submit" disabled={!isValid} />
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
