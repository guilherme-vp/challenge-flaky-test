import React, { useState } from 'react'
import { FormFields } from './10-remote-persist'

interface FieldProps {
	name: string
	value: string
	placeholder: string
	validate: (value: string) => boolean | string
	onChange: (fields: Partial<FormFields['fields']>) => void
}

interface FieldState {
	value?: string
	error?: boolean | string
}

export const Field = ({
	name,
	value: defaultValue,
	placeholder,
	onChange,
	validate
}: FieldProps) => {
	const [state, setState] = useState<FieldState>({
		value: defaultValue,
		error: false
	})

	const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		const error = validate ? validate(value) : false

		setState({
			value,
			error
		})

		onChange({ [name]: value })
	}

	return (
		<div>
			<input
				name={name}
				placeholder={placeholder}
				value={state.value}
				onChange={handleChangeField}
			/>
			<span style={{ color: 'red' }}>{state.error}</span>
		</div>
	)
}

export default Field
