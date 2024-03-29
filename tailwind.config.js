module.exports = {
	content: [
		'./src/components/**/*.js',
		'./pages/**/*.js'],
	theme: {
		extend: {
			colors: {
				brand: {
					'gray78': '#787878',
					'gray99': '#999999',
					'gray88': '#888888',
					'grayCF': '#CFCECE',
					'grayEE': '#EEEEEE',
					'gray3E': '#3E3D3D',
					'gray33': '#333333',
					'yellow': '#FFDF38',
					'grayD9': '#D9D9D9',
				}
			},
			fontFamily: {
				'sf-pro-display': [ 'SF-Pro-Display', 'Roboto', 'Helvetica', 'Verdana', 'Tahoma', 'sans-serif' ],
				'sf-pro-display-bold': [ 'SF-Pro-Display Bold', 'Roboto', 'Helvetica', 'Verdana', 'Tahoma', 'sans-serif' ],
				'sf-pro-display-medium': [ 'SF-Pro-Display Medium', 'Roboto', 'Helvetica', 'Verdana', 'Tahoma', 'sans-serif' ],
				'sf-pro-display-light': [ 'SF-Pro-Display Light', 'Roboto', 'Helvetica', 'Verdana', 'Tahoma', 'sans-serif' ],
			},
			fontSize: {
				'8px': '8px',
				'9px': '9px',
				'10px': '10px',
				'11px': '11px',
				'12px': '12px',
				'13px': '13px',
				'14px': '14px',
				'15px': '15px',
				'16px': '16px',
				'17px': '17px',
				'18px': '18px',
				'19px': '19px',
				'20px': '20px',
				'21px': '21px',
				'22px': '22px',
				'24px': '24px',
				'26px': '26px',
				'27px': '27px',
				'28px': '28px',
				'30px': '30px',
				'32px': '32px',
				'34px': '34px',
				'36px': '36px',
				'40px': '40px',
				'44px': '44px',
				'48px': '48px',
				'52px': '52px',
				'56px': '56px',
				'60px': '60px',
			},
			minHeight: {
				'50vh': '50vh'
			},
			lineHeight: {
				'0': '0',
				'1.6': '1.6',
				'12px': '12px',
				'13px': '13px',
				'14px': '14px',
				'16px': '16px',
				'17px': '17px',
				'18px': '18px',
				'19px': '19px',
				'20px': '20px',
				'22px': '22px',
				'24px': '24px',
				'26px': '26px',
				'28px': '28px',
				'30px': '30px',
				'32px': '32px',
				'35px': '35px',
				'36px': '36px',
				'40px': '40px',
				'42px': '42px',
				'48px': '48px',
				'50px': '50px',
				'56px': '56px',
				'72px': '72px',
			},
			width: {
				'900px': '900px'
			},
			maxWidth: {
				'900px': '900px',
				'400px': '400px',
				'566px': '566px',
			},
			maxHeight: {
				'566px': '566px',
				'333px': '333px'
			},
			minWidth: {
				'50px': '50px',
				'566px': '566px',
				'400px': '400px',
			},
			minHeight: {
				'50px': '50px',
				'566px': '566px',
				'333px': '333px'
			}
		},
		
	},
	variants: {},
	plugins: [
		require( 'tailwindcss' ),
		require( 'precss' ),
		require( 'autoprefixer' )
	]
}