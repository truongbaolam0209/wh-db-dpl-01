import React, { useState } from 'react';


export const GlobalFilter = ({ filter, setFilter }) => {

	const [value, setValue] = useState(filter);

	const onChange = value => {
		setTimeout(() => {
			setFilter(value || undefined);
		}, 1000);
	};

	return (
		<span>
			Search:{' '}
			<input
				value={value || ''}
				onChange={e => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
			/>
		</span>
	);
};