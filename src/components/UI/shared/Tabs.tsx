// components/CustomTabs.tsx

import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`custom-tabpanel-${index}`}
			aria-labelledby={`custom-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `custom-tab-${index}`,
		'aria-controls': `custom-tabpanel-${index}`,
	}
}

interface CustomTabsProps {
	tabLabels: string[]
	tabContents: React.ReactNode[]
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabLabels, tabContents }) => {
	const [value, setValue] = React.useState(0)

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Tabs value={value} onChange={handleChange} aria-label="custom tabs">
				{tabLabels.map((label, index) => (
					<Tab label={label} key={index} {...a11yProps(index)} />
				))}
			</Tabs>
			{tabContents.map((content, index) => (
				<CustomTabPanel key={index} value={value} index={index}>
					{content}
				</CustomTabPanel>
			))}
		</Box>
	)
}

export default CustomTabs
