import React, { useState } from 'react'
import { apiClient } from './api/client'
import type { FormFields } from './10-remote-persist'

interface SelectFields {
	department: string | null
	course: string | null
	courses?: string[]
	loading?: boolean
}

interface SelectProps {
	department: string
	onChange: (fields: Partial<FormFields['fields']>) => void
}

export const CourseSelect = ({ onChange, department: _department }: SelectProps) => {
	const [state, setState] = useState<SelectFields>({
		department: '',
		course: '',
		courses: [],
		loading: false
	})

	const fetchCourses = async (departmentValue: string) => {
		setState({ ...state, loading: true, courses: [] })

		await apiClient.loadCourses(departmentValue)(courses => {
			setState({ ...state, department: departmentValue, loading: false, courses })
		})
	}

	const onSelectDepartment = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const departmentValue = e.target.value

		setState({ ...state, department: departmentValue, course: null })
		onChange({ course: '', department: departmentValue })

		if (departmentValue) {
			await fetchCourses(departmentValue)
		}
	}

	const onSelectCourse = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const courseValue = e.target.value

		setState({ ...state, course: courseValue })
		onChange({ course: courseValue })
	}

	return (
		<div>
			<select
				name="department"
				onChange={onSelectDepartment}
				value={state.department || ''}
			>
				<option value="">Which department?</option>
				<option value="core">NodeSchool: Core</option>
				<option value="electives">NodeSchool: Electives</option>
			</select>
			<br />
			<br />
			{state.loading ? (
				<img alt="loading" src="/img/loading.gif" />
			) : !state.department || !state.courses?.length ? (
				<span />
			) : (
				<select name="course" onChange={onSelectCourse} value={state.course || ''}>
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
	)
}

export default CourseSelect
