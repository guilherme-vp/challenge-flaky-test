import React, { useState } from 'react'
import { apiClient } from './api/client'

interface SelectFields {
	department: string | null
	course: string | null
	courses?: string[]
	loading?: boolean
}

type NameField = keyof Pick<SelectFields, 'course' | 'department'>

interface SelectProps {
	department: string
	onChange: ({ name, value }: { name: NameField; value: string | null }) => void
}

export const CourseSelect = ({ department, onChange }: SelectProps) => {
	const [state, setState] = useState<SelectFields>({
		department: '',
		course: '',
		courses: [],
		loading: false
	})

	const fetchCourses = async (department: string) => {
		setState({ ...state, loading: true, courses: [] })

		await apiClient.loadCourses(department)(courses => {
			setState({ ...state, loading: false, courses })
		})
	}

	const onSelectDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const departmentValue = e.target.value
		const courseValue = null

		setState({ ...state, department: departmentValue, course: courseValue })

		onChange({ name: 'department', value: departmentValue })
		onChange({ name: 'course', value: courseValue })

		if (department) fetchCourses(department)
	}

	const onSelectCourse = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const courseValue = e.target.value

		setState({ ...state, course: courseValue })
		onChange({ name: 'course', value: courseValue })
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
