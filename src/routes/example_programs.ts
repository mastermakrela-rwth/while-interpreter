export const programs: Program[] = [
	{
		name: '42',
		code: `
x := 6;
y := 7;
z := 0;
while x > 0 do
	x := x - 1;
	v := y;
	while v > 0 do
		v := v - 1;
		z := z + 1
	end
end
`
	},

	{
		name: '42 (Free Variables)',
		code: `
while x > 0 do
	x := x - 1;
	v := y;
	while v > 0 do
		v := v - 1;
		z := z + 1
	end
end
`
	},

	{
		name: 'Fibonacci',
		code: `
x := 0;
y := 1;
z := 0;
while x < 100 do
	z := x + y;
	x := y;
	y := z
end
`
	},

	{
		name: 'Equation',
		code: `
z := (x+3) * (y-2)
`
	},
	{
		name: 'Equation Derivation',

		code: `
(2 - -4) * (11 - y)
`
	},

	{
		name: 'Bool Derivation',
		code: `
!1=1 || (true && 3 <= 4) 
`
	}
];
