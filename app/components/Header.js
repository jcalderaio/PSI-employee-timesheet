// Import libraries for making a Component
import React from 'react';
import { Text, View } from 'react-native';

// Make a Component
// **because header is a 'child' Component, it is handed the "props" Object
const Header = (props) => {
	const { textStyle, viewStyle } = styles;

	return (
		<View style={viewStyle}>
			<Text style={textStyle}>{props.headerText}</Text>
		</View>
	);
};

const styles = {
	textStyle: {
		fontSize: 20,
	},
	viewStyle: {
		backgroundColor: '#f8f8f8',
		justifyContent: 'center',
		alignItems: 'center',
		height: 60,
		paddingTop: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		elevation: 2,
		position: 'relative'
	}
};

// Export the Component (make available to other parts of the App). For every Component, other than the App, export it!
export default Header;
