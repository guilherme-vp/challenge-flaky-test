import React from 'react'

export const Field = ({
	errorMessage,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { errorMessage?: string }) => {
	return (
		<div>
			<input {...rest} />
			<span style={{ color: 'red' }}>{errorMessage}</span>
		</div>
	)
}

export default Field
